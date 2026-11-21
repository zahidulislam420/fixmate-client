'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Booking } from '@/types';
import { apiFetch } from '@/lib/api';
import {
  CalendarCheck,
  Clock,
  CheckCircle2,
  ArrowRight,
  Wrench,
  Search,
} from 'lucide-react';

export default function CustomerOverviewPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await apiFetch<{ success: boolean; bookings: Booking[] }>(
          '/bookings/my'
        );
        if (res.success && res.bookings) {
          setBookings(res.bookings);
        }
      } catch (err) {
        console.error('Error fetching customer bookings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const totalRequests = bookings.length;
  const activeJobs = bookings.filter((b) =>
    ['requested', 'accepted', 'in-progress'].includes(b.status)
  ).length;
  const completedJobs = bookings.filter((b) => b.status === 'completed').length;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-600/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase font-bold text-blue-200 tracking-wider">
            Customer Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
            Hello, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-blue-100 max-w-xl">
            Track your open repair requests, verify completion, and manage secure post-service payments.
          </p>
        </div>

        <Link
          href="/services"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-blue-700 font-extrabold text-xs shadow-md hover:bg-blue-50 transition-all shrink-0"
        >
          <Search className="w-4 h-4" />
          <span>Book New Repair</span>
        </Link>
      </div>

      {/* Reusable Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Requests */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Requests
            </span>
            <p className="text-3xl font-black text-slate-900 mt-1">
              {loading ? '-' : totalRequests}
            </p>
            <span className="text-[11px] text-slate-500 mt-1 block">Lifetime bookings</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <CalendarCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Active Jobs */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
              Active Jobs
            </span>
            <p className="text-3xl font-black text-slate-900 mt-1">
              {loading ? '-' : activeJobs}
            </p>
            <span className="text-[11px] text-slate-500 mt-1 block">Requested / In progress</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Completed Jobs */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">
              Completed Jobs
            </span>
            <p className="text-3xl font-black text-slate-900 mt-1">
              {loading ? '-' : completedJobs}
            </p>
            <span className="text-[11px] text-slate-500 mt-1 block">Successfully resolved</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Bookings preview */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Service Requests</h2>
            <p className="text-xs text-slate-400 mt-0.5">Your latest booked repairs</p>
          </div>
          <Link
            href="/dashboard/customer/bookings"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : bookings.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {bookings.slice(0, 4).map((b) => (
              <div key={b._id} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    <img src={b.serviceImage} alt={b.serviceTitle} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 line-clamp-1">{b.serviceTitle}</p>
                    <p className="text-xs text-slate-500">Tech: {b.technicianName} • ${b.finalAmount}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="capitalize px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                    {b.status}
                  </span>
                  <Link
                    href="/dashboard/customer/bookings"
                    className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-50"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400 text-xs">
            No repair requests placed yet.
          </div>
        )}
      </div>
    </div>
  );
}
