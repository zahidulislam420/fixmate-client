'use client';

import React, { useEffect, useState } from 'react';
import { Booking } from '@/types';
import { apiFetch } from '@/lib/api';
import AdminBookingsTable from './views/AdminBookingsTable';
import { ClipboardList } from 'lucide-react';

const STATUS_TABS = [
  { label: 'All Platform Jobs', value: 'All' },
  { label: 'Requested', value: 'requested' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled / Rejected', value: 'cancelled' },
];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const query = statusFilter !== 'All' ? `?status=${statusFilter}` : '';
      const res = await apiFetch<{ success: boolean; bookings: Booking[] }>(
        `/admin/bookings${query}`
      );
      if (res.success && res.bookings) {
        setBookings(res.bookings);
      }
    } catch (err) {
      console.error('Failed to load admin bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-blue-600" />
            <span>Platform Bookings Monitor</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Read-only overview of all repair requests across all registered customers and technicians.
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-2xl shadow-xs">
          {STATUS_TABS.map((tab) => {
            const isActive = statusFilter === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : bookings.length > 0 ? (
        <AdminBookingsTable bookings={bookings} />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-xs">
          <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No Bookings Found</h3>
          <p className="text-xs text-slate-500 mt-1">
            No platform bookings found matching status "{statusFilter}".
          </p>
        </div>
      )}
    </div>
  );
}
