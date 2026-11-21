'use client';

import React, { useState } from 'react';
import { Booking } from '@/types';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';
import {
  CreditCard,
  Ban,
  Clock,
  Eye,
  Star,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import CancelBookingModal from './CancelBookingModal';
import BookingTimelineModal from './BookingTimelineModal';
import ReviewModal from './ReviewModal';

interface Props {
  bookings: Booking[];
  onRefresh: () => void;
}

export default function CustomerBookingsTable({ bookings, onRefresh }: Props) {
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [timelineBooking, setTimelineBooking] = useState<Booking | null>(null);
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
  const [payingBookingId, setPayingBookingId] = useState<string | null>(null);

  // Status badge styling per PDF requirements
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

  // Cancel booking handler
  const handleConfirmCancel = async () => {
    if (!cancellingBooking) return;
    setCancelLoading(true);
    try {
      const res = await apiFetch<{ success: boolean; message: string }>(
        `/bookings/${cancellingBooking._id}/cancel`,
        { method: 'PATCH' }
      );
      if (res.success) {
        toast.success('Booking cancelled successfully');
        setCancellingBooking(null);
        onRefresh();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to cancel booking');
    } finally {
      setCancelLoading(false);
    }
  };

  // Pay Now Stripe checkout handler
  const handlePayNow = async (booking: Booking) => {
    setPayingBookingId(booking._id);
    try {
      const res = await apiFetch<{
        success: boolean;
        url: string;
        sessionId: string;
        mock?: boolean;
      }>('/payments/create-checkout-session', {
        method: 'POST',
        body: JSON.stringify({ bookingId: booking._id }),
      });

      if (res.success && res.url) {
        toast.info('Redirecting to secure payment checkout...');
        window.location.href = res.url;
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to initialize payment');
      setPayingBookingId(null);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase tracking-wider font-bold">
            <tr>
              <th className="py-4 px-6">Service</th>
              <th className="py-4 px-4">Technician</th>
              <th className="py-4 px-4">Preferred Date</th>
              <th className="py-4 px-4">Amount</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-4">Payment</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {bookings.map((b) => (
              <tr key={b._id} className="hover:bg-slate-50/70 transition-colors">
                {/* Service Image & Title */}
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      <img
                        src={b.serviceImage}
                        alt={b.serviceTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm line-clamp-1">{b.serviceTitle}</p>
                      <span className="text-[10px] text-slate-400 capitalize">{b.category}</span>
                    </div>
                  </div>
                </td>

                {/* Technician Name */}
                <td className="py-4 px-4 font-semibold text-slate-800">
                  {b.technicianName}
                </td>

                {/* Preferred Date */}
                <td className="py-4 px-4 text-slate-500">
                  {new Date(b.preferredDate).toLocaleDateString()}
                </td>

                {/* Price */}
                <td className="py-4 px-4">
                  <div>
                    <span className="font-extrabold text-slate-900 text-sm">
                      ${b.finalAmount || b.basePrice}
                    </span>
                    {b.finalAmount !== b.basePrice && (
                      <span className="block text-[10px] text-slate-400">
                        Base: ${b.basePrice}
                      </span>
                    )}
                  </div>
                </td>

                {/* Status Badge */}
                <td className="py-4 px-4">
                  <button
                    onClick={() => setTimelineBooking(b)}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold border capitalize transition-transform hover:scale-105 ${getStatusBadge(
                      b.status
                    )}`}
                    title="Click to view progress tracker"
                  >
                    <span>{b.status}</span>
                    <Clock className="w-3 h-3 opacity-60" />
                  </button>
                </td>

                {/* Payment Badge */}
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

                {/* Actions */}
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* Pay Now Button (Only completed + unpaid) */}
                    {b.status === 'completed' && b.paymentStatus === 'unpaid' && (
                      <button
                        onClick={() => handlePayNow(b)}
                        disabled={payingBookingId === b._id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-all hover:scale-105"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>{payingBookingId === b._id ? 'Processing...' : 'Pay Now'}</span>
                      </button>
                    )}

                    {/* Review Button (If paid) */}
                    {b.paymentStatus === 'paid' && (
                      <button
                        onClick={() => setReviewBooking(b)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-lg text-xs font-bold transition-colors"
                      >
                        <Star className="w-3.5 h-3.5" />
                        <span>{b.rating ? `${b.rating}★ Reviewed` : 'Review'}</span>
                      </button>
                    )}

                    {/* Cancel Button (Only requested state) */}
                    {b.status === 'requested' && (
                      <button
                        onClick={() => setCancellingBooking(b)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition-colors"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                    )}

                    {/* View Timeline Button */}
                    <button
                      onClick={() => setTimelineBooking(b)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg"
                      title="View Timeline"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      <div className="lg:hidden divide-y divide-slate-100">
        {bookings.map((b) => (
          <div key={b._id} className="p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                <img
                  src={b.serviceImage}
                  alt={b.serviceTitle}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 text-sm truncate">{b.serviceTitle}</p>
                <p className="text-xs text-slate-500">Tech: {b.technicianName}</p>
                <p className="text-xs font-extrabold text-slate-900 mt-1">
                  ${b.finalAmount || b.basePrice}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
              <span className="text-slate-400">Date: {new Date(b.preferredDate).toLocaleDateString()}</span>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize border ${getStatusBadge(b.status)}`}>
                  {b.status}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${b.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                  {b.paymentStatus}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setTimelineBooking(b)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700"
              >
                Track Status
              </button>

              {b.status === 'requested' && (
                <button
                  onClick={() => setCancellingBooking(b)}
                  className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold"
                >
                  Cancel
                </button>
              )}

              {b.status === 'completed' && b.paymentStatus === 'unpaid' && (
                <button
                  onClick={() => handlePayNow(b)}
                  disabled={payingBookingId === b._id}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold shadow-xs"
                >
                  {payingBookingId === b._id ? 'Processing...' : 'Pay Now'}
                </button>
              )}

              {b.paymentStatus === 'paid' && (
                <button
                  onClick={() => setReviewBooking(b)}
                  className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold"
                >
                  {b.rating ? `${b.rating}★` : 'Review'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <CancelBookingModal
        booking={cancellingBooking}
        isOpen={Boolean(cancellingBooking)}
        loading={cancelLoading}
        onClose={() => setCancellingBooking(null)}
        onConfirm={handleConfirmCancel}
      />

      <BookingTimelineModal
        booking={timelineBooking}
        isOpen={Boolean(timelineBooking)}
        onClose={() => setTimelineBooking(null)}
      />

      <ReviewModal
        booking={reviewBooking}
        isOpen={Boolean(reviewBooking)}
        onClose={() => setReviewBooking(null)}
        onSuccess={() => {
          setReviewBooking(null);
          onRefresh();
        }}
      />
    </div>
  );
}
