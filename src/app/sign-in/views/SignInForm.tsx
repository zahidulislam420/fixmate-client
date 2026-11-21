'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';
import { Eye, EyeOff, ShieldCheck, Wrench, User } from 'lucide-react';

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }
    if (!password) {
      toast.error('Please enter your password');
      return;
    }

    setLoading(true);
    try {
      const res = await apiFetch<{
        success: boolean;
        message: string;
        token: string;
        user: any;
      }>('/auth/sign-in', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (res.success && res.token && res.user) {
        toast.success(`Welcome back, ${res.user.name}!`);
        login(res.token, res.user);

        // Redirect logic: either explicit return URL or role dashboard
        if (redirectUrl) {
          router.push(redirectUrl);
        } else if (res.user.role === 'admin') {
          router.push('/dashboard/admin');
        } else if (res.user.role === 'technician') {
          router.push('/dashboard/technician');
        } else {
          router.push('/dashboard/customer');
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  // Quick fill demo credentials for quick tester verification
  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl shadow-slate-200/50">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Sign In to FixMate
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-500">
          Access your bookings, service listings, or admin control center.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@domain.com"
            required
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showPassword ? 'Hide' : 'Show'}</span>
            </button>
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-sm rounded-xl shadow-md shadow-blue-500/20 hover:scale-[1.01] transition-all"
        >
          {loading ? 'Authenticating...' : 'Sign In'}
        </button>
      </form>

      {/* Quick Demo Test Accounts Box */}
      <div className="mt-6 pt-6 border-t border-slate-100">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2 text-center">
          Quick Demo Login (Examiner Test Accounts)
        </span>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleQuickFill('admin@fixmate.com', 'Admin123!')}
            className="p-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-[11px] font-bold border border-purple-200 transition-colors flex flex-col items-center gap-1"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill('tech.hasan@fixmate.com', 'Tech123!')}
            className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl text-[11px] font-bold border border-amber-200 transition-colors flex flex-col items-center gap-1"
          >
            <Wrench className="w-4 h-4" />
            <span>Technician</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill('customer.sarah@fixmate.com', 'Cust123!')}
            className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-[11px] font-bold border border-blue-200 transition-colors flex flex-col items-center gap-1"
          >
            <User className="w-4 h-4" />
            <span>Customer</span>
          </button>
        </div>
      </div>

      <div className="mt-6 pt-4 text-center">
        <p className="text-xs text-slate-500">
          Don't have an account yet?{' '}
          <Link href="/sign-up" className="font-bold text-blue-600 hover:text-blue-700 underline">
            Sign Up here
          </Link>
        </p>
      </div>
    </div>
  );
}
