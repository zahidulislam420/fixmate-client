import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Booking } from '@/types';

interface Props {
  booking: Booking | null;
  isOpen: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function CancelBookingModal({
  booking,
  isOpen,
  loading,
  onClose,
  onConfirm,
}: Props) {
  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 text-center">
        <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <h3 className="text-xl font-extrabold text-slate-900">
          Cancel Repair Request?
        </h3>

        <p className="mt-2 text-xs text-slate-500 leading-relaxed">
          Are you sure you want to cancel the request for{' '}
          <strong className="text-slate-800">{booking.serviceTitle}</strong>? This action cannot be undone.
        </p>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
          >
            Keep Booking
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-600/20 transition-all"
          >
            {loading ? 'Cancelling...' : 'Yes, Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
}
