'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Service } from '@/types';
import { apiFetch } from '@/lib/api';
import TechnicianServicesTable from './views/TechnicianServicesTable';
import { FolderKanban, PlusCircle } from 'lucide-react';

export default function TechnicianServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await apiFetch<{ success: boolean; services: Service[] }>(
        '/services/technician/my'
      );
      if (res.success && res.services) {
        setServices(res.services);
      }
    } catch (err) {
      console.error('Failed to load technician services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-blue-600" />
            <span>My Service Catalog</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Full CRUD management of your repair offerings. Toggle availability or update service parameters.
          </p>
        </div>

        <Link
          href="/dashboard/technician/add-service"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Service</span>
        </Link>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : services.length > 0 ? (
        <TechnicianServicesTable services={services} onRefresh={fetchServices} />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-xs">
          <FolderKanban className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No Services Listed Yet</h3>
          <p className="text-xs text-slate-500 mt-1">
            Start by adding the repairs you perform. You can pause or modify them anytime.
          </p>
          <Link
            href="/dashboard/technician/add-service"
            className="mt-4 inline-block px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs"
          >
            Create Your First Service
          </Link>
        </div>
      )}
    </div>
  );
}
