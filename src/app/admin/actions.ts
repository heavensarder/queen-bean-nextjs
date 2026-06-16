'use server';

import { createSession, clearSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get('email')?.toString().trim();
  const password = formData.get('password')?.toString().trim();

  if (email === 'queenbeanphilly@gmail.com' && password === 'QueenBean2026@#!') {
    await createSession();
    redirect('/admin');
  }

  return { error: 'Invalid email or password' };
}

export async function logoutAction() {
  await clearSession();
  redirect('/admin/login');
}
