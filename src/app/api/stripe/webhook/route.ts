import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('Stripe-Signature') || '';

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    const session = event.data.object as any;

    switch (event.type) {
      case 'checkout.session.completed': {
        const subscriptionId = session.subscription;
        const customerId = session.customer;

        // Si se define userId en metadata, asociarlo directamente
        const userId = session.metadata?.userId;

        if (userId) {
          await db
            .update(users)
            .set({
              stripeSubscriptionId: subscriptionId,
              subscriptionStatus: 'active',
            })
            .where(eq(users.id, userId));
        } else if (customerId) {
          await db
            .update(users)
            .set({
              stripeSubscriptionId: subscriptionId,
              subscriptionStatus: 'active',
            })
            .where(eq(users.stripeCustomerId, customerId));
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const subscriptionId = session.subscription;
        if (subscriptionId) {
          await db
            .update(users)
            .set({
              subscriptionStatus: 'active',
            })
            .where(eq(users.stripeSubscriptionId, subscriptionId));
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscriptionId = session.id;
        const status = session.status;
        const subscriptionStatus = status === 'active' ? 'active' : 'canceled';

        await db
          .update(users)
          .set({
            subscriptionStatus,
          })
          .where(eq(users.stripeSubscriptionId, subscriptionId));
        break;
      }

      case 'customer.subscription.deleted': {
        const subscriptionId = session.id;

        await db
          .update(users)
          .set({
            stripeSubscriptionId: null,
            subscriptionStatus: 'none',
          })
          .where(eq(users.stripeSubscriptionId, subscriptionId));
        break;
      }

      default:
        console.log(`Unhandled Stripe Webhook Event Type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Stripe webhook processing error:', error);
    return new NextResponse('Webhook processing failed', { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
