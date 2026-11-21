'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Service, Booking } from '@/types';
import { apiFetch } from '@/lib/api';
import {
  Wrench,
  CheckCircle2,
  Clock,
  PlusCircle,
  FolderKanban,
  ClipboardList,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import ProPlanModal from './views/ProPlanModal';

export default function TechnicianOverviewPage() {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [requests, setRequests] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [proModalOpen, setProModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [servicesRes, requestsRes] = await Promise.all([
          apiFetch<{ success: boolean; services: Service[] }>('/services/technician/my'),
          apiFetch<{ success: boolean; bookings: Booking[] }>('/bookings/technician'),
        ]);

        if (servicesRes.success) setServices(servicesRes.services || []);
        if (requestsRes.success) setRequests(requestsRes.bookings || []);
      } catch (err) {
        console.error('Error fetching technician stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalServices = services.length;
  const approvedServices = services.filter((s) => s.approvalStatus === 'approved').length;
  const pendingRequests = requests.filter((r) => r.status === 'requested').length;
  const inProgressJobs = requests.filter((r) => r.status === 'in-progress').length;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase font-bold text-blue-300 tracking-wider">
            Technician Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
            Welcome, {user?.name}! 🛠️
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-xl">
            Manage your repair service listings, accept incoming requests, and record final job amounts upon completion.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setProModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-extrabold text-xs hover:bg-amber-500/30 transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Pro Plan</span>
          </button>
          <Link
            href="/dashboard/technician/add-service"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Service</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Services */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Services
            </span>
            <p className="text-3xl font-black text-slate-900 mt-1">
              {loading ? '-' : totalServices}
            </p>
            <span className="text-[11px] text-slate-500 mt-1 block">Listed repair offerings</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <FolderKanban className="w-6 h-6" />
          </div>
        </div>

        {/* Approved Services */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Approved Services
            </span>
            <p className="text-3xl font-black text-slate-900 mt-1">
              {loading ? '-' : approvedServices}
            </p>
            <span className="text-[11px] text-slate-500 mt-1 block">Live on public catalog</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Requests */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
              Pending Requests
            </span>
            <p className="text-3xl font-black text-slate-900 mt-1">
              {loading ? '-' : pendingRequests}
            </p>
            <span className="text-[11px] text-slate-500 mt-1 block">Awaiting your response</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Action Navigation Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/dashboard/technician/requests"
          className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:border-blue-400 hover:shadow-lg transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                Manage Repair Requests
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {pendingRequests} pending • {inProgressJobs} in progress
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/dashboard/technician/my-services"
          className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:border-blue-400 hover:shadow-lg transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <FolderKanban className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-purple-600 transition-colors">
                My Service Catalog (CRUD)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {totalServices} services • Edit, delete or toggle availability
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <ProPlanModal
        isOpen={proModalOpen}
        onClose={() => setProModalOpen(false)}
      />
    </div>
  );
}
