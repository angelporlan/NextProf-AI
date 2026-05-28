"use client";

import { useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { Loader2, Sparkles } from 'lucide-react';

export default function LogoutPage() {
  useEffect(() => {
    // Automatically trigger sign out upon loading the page
    const performLogout = async () => {
      try {
        await signOut({ callbackUrl: '/' });
      } catch (err) {
        console.error('Error logging out:', err);
      }
    };
    performLogout();
  }, []);

  return (
    <div className="relative min-h-screen bg-[#030712] flex items-center justify-center p-4 overflow-hidden">
      {/* Radial glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-sky-950/20 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-950/20 blur-[100px] pointer-events-none" />

      {/* Decorative background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="w-full max-w-md bg-white/5 backdrop-blur-md p-8 rounded-3xl relative z-10 border border-slate-800 text-center shadow-2xl shadow-sky-500/5">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6 animate-pulse">
          <div className="bg-gradient-to-tr from-sky-400 to-indigo-500 p-2 rounded-xl text-white shadow-md mb-6">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-white mb-8">
            Matchply
          </span>

          <div className="flex justify-center mb-6">
            <Loader2 className="w-10 h-10 text-sky-400 animate-spin stroke-[1.75]" />
          </div>
          <h2 className="text-lg font-semibold text-white tracking-tight">Cerrando sesión de forma segura...</h2>
          <p className="text-slate-400 text-xs mt-2 font-light max-w-xs leading-relaxed">
            Por favor espera un momento mientras destruimos tu sesión activa y te redirigimos de forma segura.
          </p>
        </div>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';
