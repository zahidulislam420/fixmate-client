import React from 'react';
import Link from 'next/link';
import { XCircle, ArrowLeft, RotateCcw } from 'lucide-react';

export default function PaymentCancelCard() {
  return (
    <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl text-center max-w-md mx-auto space-y-6">
      <div className="w-20 h-20 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto ring-8 ring-slate-50">
        <XCircle className="w-10 h-10" />
      </div>

      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
          Payment Cancelled
        </h2>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          No charges were applied to your payment card. Your booking remains in completed status and you can settle payment whenever convenient.
        </p>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/dashboard/customer/bookings"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Try Again in My Bookings</span>
        </Link>
        <Link
          href="/"
          className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
