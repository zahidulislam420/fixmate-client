'use client';

import React, { useState } from 'react';
import { Service } from '@/types';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';
import { Edit2, Trash2, Power, Eye, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import EditServiceModal from './EditServiceModal';
import DeleteServiceModal from './DeleteServiceModal';

interface Props {
  services: Service[];
  onRefresh: () => void;
}

export default function TechnicianServicesTable({ services, onRefresh }: Props) {
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deletingService, setDeletingService] = useState<Service | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const getApprovalBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'rejected':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // Toggle availability
  const handleToggleAvailability = async (s: Service) => {
    setTogglingId(s._id);
    try {
      const res = await apiFetch<{ success: boolean; message: string; isAvailable: boolean }>(
        `/services/${s._id}/availability`,
        { method: 'PATCH' }
      );
      if (res.success) {
        toast.success(res.message);
        onRefresh();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to toggle availability');
    } finally {
      setTogglingId(null);
    }
  };

  // Delete service
  const handleConfirmDelete = async () => {
    if (!deletingService) return;
    setDeleteLoading(true);
    try {
      const res = await apiFetch<{ success: boolean; message: string }>(
        `/services/${deletingService._id}`,
        { method: 'DELETE' }
      );
      if (res.success) {
        toast.success('Service deleted successfully');
        setDeletingService(null);
        onRefresh();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete service');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase tracking-wider font-bold">
            <tr>
              <th className="py-4 px-6">Service</th>
              <th className="py-4 px-4">Category</th>
              <th className="py-4 px-4">Base Price</th>
              <th className="py-4 px-4">Approval Status</th>
              <th className="py-4 px-4">Availability</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {services.map((s) => (
              <tr key={s._id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm line-clamp-1">{s.title}</p>
                      <span className="text-[10px] text-slate-400">{s.serviceArea} • {s.serviceMode}</span>
                    </div>
                  </div>
                </td>

                <td className="py-4 px-4 font-semibold text-slate-800">
                  {s.category}
                </td>

                <td className="py-4 px-4 font-extrabold text-slate-900 text-sm">
                  ${s.basePrice}
                </td>

                <td className="py-4 px-4">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border capitalize ${getApprovalBadge(
                      s.approvalStatus
                    )}`}
                  >
                    {s.approvalStatus}
                  </span>
                </td>

                <td className="py-4 px-4">
                  <button
                    onClick={() => handleToggleAvailability(s)}
                    disabled={togglingId === s._id}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      s.isAvailable
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                        : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    <Power className="w-3 h-3" />
                    <span>{s.isAvailable ? 'Available' : 'Paused'}</span>
                  </button>
                </td>

                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setEditingService(s)}
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Service"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingService(s)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Service"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <Link
                      href={`/services/${s._id}`}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                      title="View Public Page"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EditServiceModal
        service={editingService}
        isOpen={Boolean(editingService)}
        onClose={() => setEditingService(null)}
        onSuccess={() => {
          setEditingService(null);
          onRefresh();
        }}
      />

      <DeleteServiceModal
        service={deletingService}
        isOpen={Boolean(deletingService)}
        loading={deleteLoading}
        onClose={() => setDeletingService(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
