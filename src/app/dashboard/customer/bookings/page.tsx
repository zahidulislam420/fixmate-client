'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Booking } from '@/types';
import { apiFetch } from '@/lib/api';
import CustomerBookingsTable from './views/CustomerBookingsTable';
import { CalendarCheck, PlusCircle } from 'lucide-react';

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await apiFetch<{ success: boolean; bookings: Booking[] }>(
        '/bookings/my'
      );
      if (res.success && res.bookings) {
        setBookings(res.bookings);
      }
    } catch (err) {
      console.error('Failed to load my bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-blue-600" />
            <span>My Repair Bookings</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            View live status updates, cancel active requests, or pay online upon completion.
          </p>
        </div>

        <Link
          href="/services"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Repair Request</span>
        </Link>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : bookings.length > 0 ? (
        <CustomerBookingsTable bookings={bookings} onRefresh={fetchBookings} />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-xs">
          <CalendarCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No Bookings Yet</h3>
          <p className="text-xs text-slate-500 mt-1">
            You haven't requested any repair services. Find a verified technician and book doorstep service.
          </p>
          <Link
            href="/services"
            className="mt-4 inline-block px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs"
          >
            Browse Services
          </Link>
        </div>
      )}
    </div>
  );
}
