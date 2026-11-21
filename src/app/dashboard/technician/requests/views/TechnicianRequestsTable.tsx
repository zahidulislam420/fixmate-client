'use client';

import React, { useState } from 'react';
import { Booking } from '@/types';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';
import {
  Check,
  X,
  Play,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  FileText,
  CreditCard,
} from 'lucide-react';
import CompleteBookingModal from './CompleteBookingModal';
import RejectBookingModal from './RejectBookingModal';

interface Props {
  bookings: Booking[];
  onRefresh: () => void;
}

export default function TechnicianRequestsTable({ bookings, onRefresh }: Props) {
  const [rejectingBooking, setRejectingBooking] = useState<Booking | null>(null);
  const [completingBooking, setCompletingBooking] = useState<Booking | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

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

  // Pipeline transitions: Accept
  const handleAccept = async (b: Booking) => {
    setActionLoading(true);
    try {
      const res = await apiFetch<{ success: boolean; message: string }>(
        `/bookings/${b._id}/status`,
        {
          method: 'PATCH',
          body: JSON.stringify({ status: 'accepted' }),
        }
      );
      if (res.success) {
        toast.success('Request accepted! Proceed with scheduling.');
        onRefresh();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to accept request');
    } finally {
      setActionLoading(false);
    }
  };

  // Pipeline transitions: Start Work (in-progress)
  const handleStartWork = async (b: Booking) => {
    setActionLoading(true);
    try {
      const res = await apiFetch<{ success: boolean; message: string }>(
        `/bookings/${b._id}/status`,
        {
          method: 'PATCH',
          body: JSON.stringify({ status: 'in-progress' }),
        }
      );
      if (res.success) {
        toast.success('Work marked In Progress! Customer can see real-time status.');
        onRefresh();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to start work');
    } finally {
      setActionLoading(false);
    }
  };

  // Pipeline transitions: Reject (Terminal)
  const handleConfirmReject = async () => {
    if (!rejectingBooking) return;
    setActionLoading(true);
    try {
      const res = await apiFetch<{ success: boolean; message: string }>(
        `/bookings/${rejectingBooking._id}/status`,
        {
          method: 'PATCH',
          body: JSON.stringify({ status: 'rejected' }),
        }
      );
      if (res.success) {
        toast.success('Request declined');
        setRejectingBooking(null);
        onRefresh();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to reject request');
    } finally {
      setActionLoading(false);
    }
  };

  // Pipeline transitions: Complete with finalAmount
  const handleConfirmComplete = async (finalAmount: number) => {
    if (!completingBooking) return;
    setActionLoading(true);
    try {
      const res = await apiFetch<{ success: boolean; message: string }>(
        `/bookings/${completingBooking._id}/status`,
        {
          method: 'PATCH',
          body: JSON.stringify({ status: 'completed', finalAmount }),
        }
      );
      if (res.success) {
        toast.success(`Job marked completed! Final invoice generated for $${finalAmount}.`);
        setCompletingBooking(null);
        onRefresh();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to complete job');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden xl:block overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase tracking-wider font-bold">
            <tr>
              <th className="py-4 px-6">Service & Customer</th>
              <th className="py-4 px-4">Contact & Location</th>
              <th className="py-4 px-4">Preferred Date</th>
              <th className="py-4 px-4">Problem Issue</th>
              <th className="py-4 px-4">Amount</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-6 text-right">Pipeline Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {bookings.map((b) => (
              <tr key={b._id} className="hover:bg-slate-50/70 transition-colors">
                {/* Service & Customer */}
                <td className="py-4 px-6">
                  <div>
                    <p className="font-bold text-slate-900 text-sm line-clamp-1">{b.serviceTitle}</p>
                    <p className="text-xs font-semibold text-blue-600 mt-0.5">{b.customerName}</p>
                  </div>
                </td>

                {/* Contact & Location */}
                <td className="py-4 px-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{b.customerPhone}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 text-[11px] max-w-[180px] truncate">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{b.address}</span>
                    </div>
                  </div>
                </td>

                {/* Preferred Date */}
                <td className="py-4 px-4 text-slate-500 whitespace-nowrap">
                  {new Date(b.preferredDate).toLocaleDateString()}
                </td>

                {/* Problem Description */}
                <td className="py-4 px-4 max-w-[200px]">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed" title={b.problemDescription}>
                    {b.problemDescription}
                  </p>
                </td>

                {/* Amount */}
                <td className="py-4 px-4 font-black text-slate-900 text-sm">
                  ${b.finalAmount || b.basePrice}
                </td>

                {/* Status Badge */}
                <td className="py-4 px-4">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border capitalize ${getStatusBadge(
                      b.status
                    )}`}
                  >
                    {b.status}
                  </span>
                </td>

                {/* Valid Action Buttons for Each Status (Strict Server Enforced) */}
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* Status: requested -> Accept / Reject */}
                    {b.status === 'requested' && (
                      <>
                        <button
                          onClick={() => handleAccept(b)}
                          disabled={actionLoading}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() => setRejectingBooking(b)}
                          disabled={actionLoading}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </>
                    )}

                    {/* Status: accepted -> Start Work (in-progress) */}
                    {b.status === 'accepted' && (
                      <button
                        onClick={() => handleStartWork(b)}
                        disabled={actionLoading}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs transition-all hover:scale-105"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Start Work</span>
                      </button>
                    )}

                    {/* Status: in-progress -> Mark Completed */}
                    {b.status === 'in-progress' && (
                      <button
                        onClick={() => setCompletingBooking(b)}
                        disabled={actionLoading}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-all hover:scale-105"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Completed</span>
                      </button>
                    )}

                    {/* Completed, Rejected, Cancelled -> No action, show payment badge for completed */}
                    {b.status === 'completed' && (
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
                          b.paymentStatus === 'paid'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>{b.paymentStatus === 'paid' ? 'Paid ($' + b.finalAmount + ')' : 'Unpaid (Awaiting Customer)'}</span>
                      </span>
                    )}

                    {(b.status === 'rejected' || b.status === 'cancelled') && (
                      <span className="text-xs text-slate-400 font-semibold italic">
                        No actions available
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      <div className="xl:hidden divide-y divide-slate-100">
        {bookings.map((b) => (
          <div key={b._id} className="p-4 sm:p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border capitalize ${getStatusBadge(b.status)}`}>
                {b.status}
              </span>
              <span className="font-extrabold text-sm text-slate-900">
                ${b.finalAmount || b.basePrice}
              </span>
            </div>

            <div>
              <p className="font-bold text-slate-900 text-sm">{b.serviceTitle}</p>
              <p className="text-xs font-semibold text-blue-600 mt-0.5">
                Customer: {b.customerName} ({b.customerPhone})
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Address: {b.address}</p>
              <p className="text-xs text-slate-500 mt-0.5">Preferred: {new Date(b.preferredDate).toLocaleDateString()}</p>
              <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-2">
                "{b.problemDescription}"
              </p>
            </div>

            {/* Mobile Actions */}
            <div className="pt-2 flex items-center justify-end gap-2">
              {b.status === 'requested' && (
                <>
                  <button
                    onClick={() => handleAccept(b)}
                    className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-xs"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => setRejectingBooking(b)}
                    className="px-4 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold"
                  >
                    Reject
                  </button>
                </>
              )}

              {b.status === 'accepted' && (
                <button
                  onClick={() => handleStartWork(b)}
                  className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold shadow-xs"
                >
                  Start Work
                </button>
              )}

              {b.status === 'in-progress' && (
                <button
                  onClick={() => setCompletingBooking(b)}
                  className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold shadow-xs"
                >
                  Mark Completed
                </button>
              )}

              {b.status === 'completed' && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {b.paymentStatus === 'paid' ? 'Paid' : 'Unpaid (Pending Customer)'}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <CompleteBookingModal
        booking={completingBooking}
        isOpen={Boolean(completingBooking)}
        loading={actionLoading}
        onClose={() => setCompletingBooking(null)}
        onConfirm={handleConfirmComplete}
      />

      <RejectBookingModal
        booking={rejectingBooking}
        isOpen={Boolean(rejectingBooking)}
        loading={actionLoading}
        onClose={() => setRejectingBooking(null)}
        onConfirm={handleConfirmReject}
      />
    </div>
  );
}
