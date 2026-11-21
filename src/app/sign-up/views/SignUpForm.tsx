'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';
import { User, Wrench, Shield, Check, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function SignUpForm() {
  const router = useRouter();
  const { login } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'technician'>('customer');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validation rules
  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const isPasswordValid = hasMinLength && hasUppercase && hasLowercase;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter your full name');
      return;
    }

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!isPasswordValid) {
      toast.error('Please fulfill all password security rules');
      return;
    }

    setLoading(true);
    try {
      const res = await apiFetch<{
        success: boolean;
        message: string;
        token: string;
        user: any;
      }>('/auth/sign-up', {
        method: 'POST',
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          role,
        }),
      });

      if (res.success && res.token && res.user) {
        toast.success('Account created successfully! Welcome to FixMate.');
        login(res.token, res.user);

        // Redirect to role dashboard
        if (res.user.role === 'technician') {
          router.push('/dashboard/technician');
        } else {
          router.push('/dashboard/customer');
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl shadow-slate-200/50">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Create Your Account
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-500">
          Join thousands of satisfied customers and verified technicians.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Role Selection Cards */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">
            Select Account Role
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('customer')}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                role === 'customer'
                  ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20'
                  : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <User className={`w-5 h-5 ${role === 'customer' ? 'text-blue-600' : 'text-slate-400'}`} />
                {role === 'customer' && <Check className="w-4 h-4 text-blue-600" />}
              </div>
              <div>
                <p className="text-sm font-bold">I am a Customer</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Book repairs & pay safely</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRole('technician')}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                role === 'technician'
                  ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20'
                  : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Wrench className={`w-5 h-5 ${role === 'technician' ? 'text-blue-600' : 'text-slate-400'}`} />
                {role === 'technician' && <Check className="w-4 h-4 text-blue-600" />}
              </div>
              <div>
                <p className="text-sm font-bold">I am a Technician</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Offer services & manage jobs</p>
              </div>
            </button>
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. John Doe"
            required
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs"
          />
        </div>

        {/* Email Address */}
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

        {/* Password & Live Rules Validation */}
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
            placeholder="Enter secure password"
            required
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs"
          />

          {/* Password Validation Indicators */}
          <div className="mt-2.5 space-y-1.5 p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs">
            <div className="flex items-center gap-2">
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                  hasMinLength ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                }`}
              >
                ✓
              </span>
              <span className={hasMinLength ? 'text-emerald-700 font-semibold' : 'text-slate-500'}>
                At least 6 characters
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                  hasUppercase ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                }`}
              >
                ✓
              </span>
              <span className={hasUppercase ? 'text-emerald-700 font-semibold' : 'text-slate-500'}>
                At least one uppercase letter (A-Z)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                  hasLowercase ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                }`}
              >
                ✓
              </span>
              <span className={hasLowercase ? 'text-emerald-700 font-semibold' : 'text-slate-500'}>
                At least one lowercase letter (a-z)
              </span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !isPasswordValid}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none text-white font-extrabold text-sm rounded-xl shadow-md shadow-blue-500/20 hover:scale-[1.01] transition-all"
        >
          {loading ? 'Creating Account...' : 'Sign Up as ' + (role === 'technician' ? 'Technician' : 'Customer')}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-500">
          Already have an account?{' '}
          <Link href="/sign-in" className="font-bold text-blue-600 hover:text-blue-700 underline">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
}
