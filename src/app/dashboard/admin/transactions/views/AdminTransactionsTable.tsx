'use client';

import React from 'react';
import { PaymentRecord } from '@/types';
import { CheckCircle2, DollarSign } from 'lucide-react';

interface Props {
  payments: PaymentRecord[];
}

export default function AdminTransactionsTable({ payments }: Props) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase tracking-wider font-bold">
            <tr>
              <th className="py-4 px-6">Service Title</th>
              <th className="py-4 px-4">Customer</th>
              <th className="py-4 px-4">Technician</th>
              <th className="py-4 px-4">Amount</th>
              <th className="py-4 px-4">Transaction ID</th>
              <th className="py-4 px-4">Stripe Session</th>
              <th className="py-4 px-6 text-right">Payment Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {payments.map((p) => (
              <tr key={p._id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-4 px-6 font-bold text-slate-900">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="line-clamp-1">{p.serviceTitle}</span>
                  </div>
                </td>

                <td className="py-4 px-4">
                  <p className="font-semibold text-slate-900">{p.customerName}</p>
                  <p className="text-[11px] text-slate-400">{p.customerEmail}</p>
                </td>

                <td className="py-4 px-4">
                  <p className="font-semibold text-slate-900">{p.technicianName}</p>
                  <p className="text-[11px] text-slate-400">{p.technicianEmail}</p>
                </td>

                <td className="py-4 px-4 font-black text-slate-900 text-sm">
                  ${p.amount}
                </td>

                <td className="py-4 px-4 font-mono text-[11px] text-slate-500 truncate max-w-[140px]">
                  {p.transactionId}
                </td>

                <td className="py-4 px-4 font-mono text-[10px] text-slate-400 truncate max-w-[130px]">
                  {p.stripeSessionId}
                </td>

                <td className="py-4 px-6 text-right text-slate-500 whitespace-nowrap">
                  {new Date(p.paidAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
