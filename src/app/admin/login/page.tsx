'use client';

import { useActionState } from 'react';
import { loginAction } from '@/app/admin/actions';
import { motion } from 'framer-motion';

const initialState = {
  error: '',
};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <div className="min-h-screen bg-[#F2EFEB] flex flex-col justify-center items-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 lg:p-12 border border-zinc-200"
      >
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="https://i.postimg.cc/Yqr4m6jh/queen-been-icon.png" alt="Queen Bean" className="w-12 h-12 object-contain" />
            <span className="text-2xl font-black font-brandon uppercase tracking-wider text-zinc-900">Queen Bean</span>
          </div>
          <h1 className="font-anton text-4xl uppercase tracking-wider text-zinc-900">Admin Portal</h1>
        </div>

        <form action={formAction} className="space-y-6">
          <div>
            <label className="block font-brandon text-xs uppercase tracking-widest text-zinc-500 mb-2 font-bold">Email Address</label>
            <input 
              type="email" 
              name="email"
              required
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50 focus:border-[#86603A] transition-all"
              placeholder="admin@queenbean.com"
            />
          </div>

          <div>
            <label className="block font-brandon text-xs uppercase tracking-widest text-zinc-500 mb-2 font-bold">Password</label>
            <input 
              type="password" 
              name="password"
              required
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 font-brandon focus:outline-none focus:ring-2 focus:ring-[#86603A]/50 focus:border-[#86603A] transition-all"
              placeholder="••••••••"
            />
          </div>

          {state?.error && (
            <motion.p 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="text-red-500 text-sm font-brandon font-bold text-center"
            >
              {state.error}
            </motion.p>
          )}

          <button 
            type="submit" 
            disabled={isPending}
            className="w-full bg-black text-white rounded-xl py-4 font-brandon uppercase tracking-widest text-sm font-bold hover:bg-[#86603A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {isPending ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
