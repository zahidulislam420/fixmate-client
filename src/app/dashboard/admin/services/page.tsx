'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Service } from '@/types';
import { apiFetch } from '@/lib/api';
import AdminServicesTable from './views/AdminServicesTable';
import { CheckSquare } from 'lucide-react';

const FILTER_TABS = [
  { label: 'All Services', value: 'All' },
  { label: 'Pending Review', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
];

function AdminServicesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get('approvalStatus') || 'All';

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const query = activeTab !== 'All' ? `?approvalStatus=${activeTab}` : '';
      const res = await apiFetch<{ success: boolean; services: Service[] }>(
        `/admin/services${query}`
      );
      if (res.success && res.services) {
        setServices(res.services);
      }
    } catch (err) {
      console.error('Failed to load admin services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [activeTab]);

  const handleTabChange = (val: string) => {
    if (val === 'All') {
      router.push('/dashboard/admin/services');
    } else {
      router.push(`/dashboard/admin/services?approvalStatus=${val}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-blue-600" />
            <span>Service Moderation & Approvals</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review technician service listings. Only approved services appear on public catalog.
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-2xl shadow-xs">
          {FILTER_TABS.map((tab) => {
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => handleTabChange(tab.value)}
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
      ) : services.length > 0 ? (
        <AdminServicesTable services={services} onRefresh={fetchServices} />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-xs">
          <CheckSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No Services Found</h3>
          <p className="text-xs text-slate-500 mt-1">
            No services currently match the selected filter "{activeTab}".
          </p>
        </div>
      )}
    </div>
  );
}

export default function AdminServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AdminServicesContent />
    </Suspense>
  );
}
