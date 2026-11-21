'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import {
  Users,
  Wrench,
  CheckSquare,
  ClipboardList,
  Receipt,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  totalTechnicians: number;
  pendingServices: number;
  totalBookings: number;
  totalRevenue: number;
}

export default function AdminOverviewPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await apiFetch<{ success: boolean; stats: AdminStats }>(
          '/admin/stats'
        );
        if (res.success && res.stats) {
          setStats(res.stats);
        }
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase font-bold text-purple-300 tracking-wider">
            Super Administrator Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
            Platform Operations & Moderation 🛡️
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-xl">
            Review technician catalog submissions, manage user roles, and monitor cross-platform Stripe revenue.
          </p>
        </div>

        <Link
          href="/dashboard/admin/services?approvalStatus=pending"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-md transition-all shrink-0"
        >
          <CheckSquare className="w-4 h-4" />
          <span>Pending Approvals ({stats?.pendingServices || 0})</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Users
            </span>
            <p className="text-3xl font-black text-slate-900 mt-1">
              {loading ? '-' : stats?.totalUsers}
            </p>
            <span className="text-[11px] text-slate-500 mt-1 block">Registered accounts</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Total Technicians */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
              Technicians
            </span>
            <p className="text-3xl font-black text-slate-900 mt-1">
              {loading ? '-' : stats?.totalTechnicians}
            </p>
            <span className="text-[11px] text-slate-500 mt-1 block">Active service providers</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Wrench className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Services */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
              Pending Services
            </span>
            <p className="text-3xl font-black text-slate-900 mt-1">
              {loading ? '-' : stats?.pendingServices}
            </p>
            <span className="text-[11px] text-slate-500 mt-1 block">Awaiting admin review</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <CheckSquare className="w-6 h-6" />
          </div>
        </div>

        {/* Total Platform Revenue */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Total Revenue
            </span>
            <p className="text-3xl font-black text-slate-900 mt-1">
              ${loading ? '-' : stats?.totalRevenue?.toFixed(2)}
            </p>
            <span className="text-[11px] text-emerald-600 mt-1 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>Stripe verified</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Receipt className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Moderation Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/dashboard/admin/services"
          className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:border-blue-400 hover:shadow-lg transition-all group flex items-center justify-between"
        >
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Moderation</span>
            <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors mt-1">
              Service Catalog Approvals
            </h3>
            <p className="text-xs text-slate-500 mt-1">Approve or reject technician offerings</p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/dashboard/admin/users"
          className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:border-blue-400 hover:shadow-lg transition-all group flex items-center justify-between"
        >
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Access Control</span>
            <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors mt-1">
              User & Role Management
            </h3>
            <p className="text-xs text-slate-500 mt-1">Manage customer, technician & admin privileges</p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/dashboard/admin/transactions"
          className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:border-blue-400 hover:shadow-lg transition-all group flex items-center justify-between"
        >
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Financial Ledger</span>
            <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors mt-1">
              Platform Transactions
            </h3>
            <p className="text-xs text-slate-500 mt-1">Track all Stripe checkout events</p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
