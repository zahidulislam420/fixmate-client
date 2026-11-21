'use client';

import React from 'react';
import { Booking } from '@/types';
import { CheckCircle, Clock } from 'lucide-react';

interface Props {
  bookings: Booking[];
}

export default function AdminBookingsTable({ bookings }: Props) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'requested':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'accepted':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'in-progress':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'completed':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'rejected':
      case 'cancelled':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase tracking-wider font-bold">
            <tr>
              <th className="py-4 px-6">Service</th>
              <th className="py-4 px-4">Customer</th>
              <th className="py-4 px-4">Technician</th>
              <th className="py-4 px-4">Booking Date</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-4">Payment</th>
              <th className="py-4 px-6 text-right">Settled Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {bookings.map((b) => (
              <tr key={b._id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-4 px-6 font-bold text-slate-900">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      <img src={b.serviceImage} alt={b.serviceTitle} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="line-clamp-1 text-sm">{b.serviceTitle}</p>
                      <span className="text-[10px] text-slate-400">{b.category}</span>
                    </div>
                  </div>
                </td>

                <td className="py-4 px-4">
                  <p className="font-semibold text-slate-900">{b.customerName}</p>
                  <p className="text-[11px] text-slate-400">{b.customerEmail}</p>
                </td>

                <td className="py-4 px-4">
                  <p className="font-semibold text-slate-900">{b.technicianName}</p>
                  <p className="text-[11px] text-slate-400">{b.technicianEmail}</p>
                </td>

                <td className="py-4 px-4 text-slate-500 whitespace-nowrap">
                  {new Date(b.preferredDate).toLocaleDateString()}
                </td>

                <td className="py-4 px-4">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border capitalize ${getStatusBadge(
                      b.status
                    )}`}
                  >
                    {b.status}
                  </span>
                </td>

                <td className="py-4 px-4">
                  {b.paymentStatus === 'paid' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <CheckCircle className="w-3 h-3" />
                      <span>Paid</span>
                    </span>
                  ) : (
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                      Unpaid
                    </span>
                  )}
                </td>

                <td className="py-4 px-6 text-right font-black text-slate-900 text-sm">
                  ${b.finalAmount || b.basePrice}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
