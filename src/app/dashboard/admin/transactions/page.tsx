'use client';

import React, { useEffect, useState } from 'react';
import { PaymentRecord } from '@/types';
import { apiFetch } from '@/lib/api';
import AdminTransactionsTable from './views/AdminTransactionsTable';
import { Receipt, TrendingUp, DollarSign } from 'lucide-react';

export default function AdminTransactionsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTransactions() {
      try {
        const res = await apiFetch<{
          success: boolean;
          payments: PaymentRecord[];
          totalRevenue: number;
        }>('/admin/transactions');
        if (res.success) {
          setPayments(res.payments || []);
          setTotalRevenue(res.totalRevenue || 0);
        }
      } catch (err) {
        console.error('Failed to load admin transactions:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTransactions();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Header with Total Revenue Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Receipt className="w-6 h-6 text-blue-600" />
            <span>Platform Revenue & Transactions</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Full transaction records from Stripe Checkout events across all completed bookings.
          </p>
        </div>

        {/* Total Revenue Highlight Banner */}
        <div className="bg-gradient-to-tr from-emerald-600 to-teal-700 text-white px-6 py-3.5 rounded-2xl shadow-md flex items-center gap-4 self-start sm:self-auto">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-100 block">
              Total Platform Revenue
            </span>
            <span className="text-2xl font-black tracking-tight">
              ${loading ? '-' : totalRevenue.toFixed(2)} USD
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : payments.length > 0 ? (
        <AdminTransactionsTable payments={payments} />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-xs">
          <Receipt className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No Transactions Yet</h3>
          <p className="text-xs text-slate-500 mt-1">
            Completed bookings with Stripe payments will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
