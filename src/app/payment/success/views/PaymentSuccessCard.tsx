'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { CheckCircle2, Receipt, ArrowRight, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PaymentData {
  serviceTitle: string;
  amount: number;
  transactionId: string;
  technicianName: string;
}

export default function PaymentSuccessCard() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [payment, setPayment] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function verify() {
      if (!sessionId) {
        setError('Missing checkout session ID');
        setLoading(false);
        return;
      }

      try {
        const res = await apiFetch<{
          success: boolean;
          payment: any;
          message?: string;
        }>(`/payments/verify?session_id=${sessionId}`);

        if (res.success && res.payment) {
          setPayment(res.payment);
          // Launch confetti celebration
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } else {
          setError(res.message || 'Payment verification failed');
        }
      } catch (err: any) {
        console.error('Verification error:', err);
        setError(err.message || 'Payment verification could not be completed');
      } finally {
        setLoading(false);
      }
    }

    verify();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl text-center max-w-lg mx-auto">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-900">Verifying Payment with Stripe...</h3>
        <p className="text-xs text-slate-500 mt-1">
          Securing your transaction and updating the booking record.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl text-center max-w-lg mx-auto space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <Receipt className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-extrabold text-slate-900">Verification Notice</h3>
        <p className="text-xs text-slate-600">{error}</p>
        <div className="pt-4">
          <Link
            href="/dashboard/customer/bookings"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-xs"
          >
            <span>Back to My Bookings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-2xl text-center max-w-lg mx-auto space-y-6">
      <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50 shadow-sm animate-in zoom-in duration-200">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Payment Verified & Confirmed</span>
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
          Payment Successful!
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Thank you for choosing FixMate. Your repair technician has been credited.
        </p>
      </div>

      {/* Payment Summary Box */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 text-left space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 font-semibold">Service</span>
          <span className="font-bold text-slate-800 line-clamp-1 max-w-[200px]">
            {payment?.serviceTitle}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400 font-semibold">Technician</span>
          <span className="font-bold text-slate-800">{payment?.technicianName}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400 font-semibold">Transaction ID</span>
          <span className="font-mono text-[11px] text-slate-600 truncate max-w-[180px]">
            {payment?.transactionId}
          </span>
        </div>
        <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm">
          <span className="font-extrabold text-slate-900">Amount Paid:</span>
          <span className="font-black text-emerald-600 text-lg">
            ${payment?.amount.toFixed(2)} USD
          </span>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
        <Link
          href="/dashboard/customer/bookings"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all text-center flex items-center justify-center gap-1.5"
        >
          <span>View in My Bookings</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/dashboard/customer/payments"
          className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all text-center"
        >
          Download PDF Receipt
        </Link>
      </div>
    </div>
  );
}
