'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Service } from '@/types';
import { apiFetch } from '@/lib/api';
import { X, Calendar, MapPin, Phone, FileText, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface Props {
  service: Service;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BookingRequestModal({
  service,
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const { user } = useAuth();

  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.area || '');
  const [preferredDate, setPreferredDate] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [submittedBookingId, setSubmittedBookingId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Compute minimum date (today) in YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone.trim()) {
      toast.error('Please enter a contact phone number');
      return;
    }
    if (!address.trim()) {
      toast.error('Please enter the service/pickup address');
      return;
    }
    if (!preferredDate) {
      toast.error('Please select your preferred service date');
      return;
    }
    if (problemDescription.trim().length < 20) {
      toast.error('Problem description must be at least 20 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await apiFetch<{
        success: boolean;
        message: string;
        booking: { _id: string };
      }>('/bookings', {
        method: 'POST',
        body: JSON.stringify({
          serviceId: service._id,
          customerPhone: phone.trim(),
          address: address.trim(),
          preferredDate,
          problemDescription: problemDescription.trim(),
        }),
      });

      if (res.success) {
        toast.success('Repair request submitted successfully!');
        setSubmittedBookingId(res.booking._id);
        onSuccess();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">
              Request Repair Service
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{service.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedBookingId ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">Request Sent!</h4>
            <p className="text-sm text-slate-600 max-w-sm mx-auto">
              Your request has been received by <strong className="text-slate-900">{service.technicianName}</strong>. You can track status updates in your dashboard.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/dashboard/customer/bookings"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all text-center"
              >
                Go to My Bookings
              </Link>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Read-only Customer Info */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Customer Name</span>
                <span className="font-bold text-slate-800">{user?.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Customer Email</span>
                <span className="font-bold text-slate-800 truncate block">{user?.email}</span>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                <span>Contact Phone</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+880 1700 000000"
                required
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>Service Address / Pickup Location</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House / Road / Area, e.g. Dhanmondi, Dhaka"
                required
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            {/* Preferred Date */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>Preferred Service Date</span>
              </label>
              <input
                type="date"
                min={todayStr}
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Today or a future date only
              </span>
            </div>

            {/* Problem Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Problem Description (Min 20 Characters)</span>
              </label>
              <textarea
                rows={3}
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                placeholder="Describe device symptoms, error codes, what happened, and any previous repair history..."
                required
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <div className="flex justify-between text-[11px] mt-1 text-slate-400">
                <span>Minimum 20 characters required</span>
                <span className={problemDescription.length < 20 ? 'text-amber-600' : 'text-emerald-600 font-bold'}>
                  {problemDescription.length} / 20
                </span>
              </div>
            </div>

            {/* Pricing Notice */}
            <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-900 flex items-center justify-between">
              <div>
                <span className="block font-bold">Estimated Base Price: ${service.basePrice}</span>
                <span className="text-[11px] text-blue-700">No advance payment needed. Pay after work.</span>
              </div>
              <span className="px-2 py-1 rounded bg-blue-600 text-white font-bold text-[10px] uppercase">
                Pay After
              </span>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || problemDescription.length < 20}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-500/20"
              >
                {loading ? 'Submitting...' : 'Confirm Request'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
