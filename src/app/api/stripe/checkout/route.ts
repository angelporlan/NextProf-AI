import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { stripe } from '@/lib/stripe';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const userId = session.user.id;

    // 1. Obtener datos del usuario
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    let customerId = user.stripeCustomerId;

    // 2. Crear cliente de Stripe si no existe
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: {
          userId: user.id
        }
      });
      customerId = customer.id;

      await db
        .update(users)
        .set({ stripeCustomerId: customerId })
        .where(eq(users.id, userId));
    }

    // 3. Obtener Stripe Price ID desde variables de entorno
    const priceId = process.env.STRIPE_PRICE_ID_PRO;
    if (!priceId || priceId.includes("price_...")) {
      return new NextResponse('Stripe Price ID Pro not configured', { status: 500 });
    }

    // 4. Crear sesión de checkout de Stripe
    const origin = req.nextUrl.origin;
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/dashboard?checkout=success`,
      cancel_url: `${origin}/dashboard?checkout=cancel`,
      metadata: {
        userId: user.id
      }
    });

    if (!checkoutSession.url) {
      throw new Error('Failed to create stripe checkout session URL');
    }

    return NextResponse.redirect(checkoutSession.url);
  } catch (error: any) {
    console.error('Error in Stripe checkout:', error);
    return new NextResponse(error.message || 'Internal Server Error', { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
