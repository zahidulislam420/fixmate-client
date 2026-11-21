'use client';

import React, { useEffect, useState } from 'react';
import { PaymentRecord } from '@/types';
import { apiFetch } from '@/lib/api';
import PaymentHistoryTable from './views/PaymentHistoryTable';
import { CreditCard } from 'lucide-react';

export default function CustomerPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPayments() {
      try {
        const res = await apiFetch<{ success: boolean; payments: PaymentRecord[] }>(
          '/payments/my'
        );
        if (res.success && res.payments) {
          setPayments(res.payments);
        }
      } catch (err) {
        console.error('Failed to load payments:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPayments();
  }, []);

  const totalSpent = payments.reduce((acc, p) => acc + (p.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-blue-600" />
            <span>Payment History</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified Stripe transactions and downloadable PDF receipts for completed repair services.
          </p>
        </div>

        <div className="bg-white border border-slate-200 px-4 py-2.5 rounded-2xl shadow-xs text-right self-start sm:self-auto">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Total Settle Amount
          </span>
          <span className="text-xl font-black text-slate-900">
            ${totalSpent.toFixed(2)}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-16 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : payments.length > 0 ? (
        <PaymentHistoryTable payments={payments} />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-xs">
          <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No Payments Yet</h3>
          <p className="text-xs text-slate-500 mt-1">
            You have not completed any payments yet. Pay online only after your technician completes the repair.
          </p>
        </div>
      )}
    </div>
  );
}
