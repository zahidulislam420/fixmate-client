'use client';

import React, { useState, useEffect } from 'react';
import { Booking } from '@/types';
import { CheckCircle2, DollarSign, X } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  booking: Booking | null;
  isOpen: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: (finalAmount: number) => void;
}

export default function CompleteBookingModal({
  booking,
  isOpen,
  loading,
  onClose,
  onConfirm,
}: Props) {
  const [amount, setAmount] = useState<string>('');

  useEffect(() => {
    if (booking) {
      setAmount(String(booking.finalAmount || booking.basePrice));
    }
  }, [booking]);

  if (!isOpen || !booking) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) {
      toast.error('Final amount must be a number greater than 0');
      return;
    }
    onConfirm(parsed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-extrabold text-slate-900">Mark Job Completed</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
            <p className="font-bold text-slate-800">{booking.serviceTitle}</p>
            <p className="text-slate-500 mt-0.5">Customer: {booking.customerName} ({booking.customerPhone})</p>
            <p className="text-slate-500">Base Quote: ${booking.basePrice}</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              <span>Final Settlement Amount (USD)</span>
            </label>
            <input
              type="number"
              min="1"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 55"
              required
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Pre-filled with base price. Adjust if replacement spare parts were added.
            </span>
          </div>

          <div className="flex items-center gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20"
            >
              {loading ? 'Completing...' : 'Confirm Completion'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
