'use client';

import React, { useState } from 'react';
import { Service } from '@/types';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';
import { Check, X, Shield, ExternalLink, Clock } from 'lucide-react';
import Link from 'next/link';

interface Props {
  services: Service[];
  onRefresh: () => void;
}

export default function AdminServicesTable({ services, onRefresh }: Props) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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

  const handleApprovalChange = async (service: Service, status: 'approved' | 'rejected') => {
    setUpdatingId(service._id);
    try {
      const res = await apiFetch<{ success: boolean; message: string }>(
        `/admin/services/${service._id}/approval`,
        {
          method: 'PATCH',
          body: JSON.stringify({ approvalStatus: status }),
        }
      );

      if (res.success) {
        toast.success(`Service "${service.title}" has been ${status}!`);
        onRefresh();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update approval status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase tracking-wider font-bold">
            <tr>
              <th className="py-4 px-6">Service Offering</th>
              <th className="py-4 px-4">Technician</th>
              <th className="py-4 px-4">Base Price</th>
              <th className="py-4 px-4">Mode & Area</th>
              <th className="py-4 px-4">Current Status</th>
              <th className="py-4 px-6 text-right">Moderation Actions</th>
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
                      <span className="text-[10px] text-slate-400 capitalize">{s.category}</span>
                    </div>
                  </div>
                </td>

                <td className="py-4 px-4">
                  <p className="font-semibold text-slate-900">{s.technicianName}</p>
                  <p className="text-[11px] text-slate-400">{s.technicianEmail}</p>
                </td>

                <td className="py-4 px-4 font-black text-slate-900 text-sm">
                  ${s.basePrice}
                </td>

                <td className="py-4 px-4 text-slate-600">
                  <p className="font-medium">{s.serviceMode}</p>
                  <p className="text-[11px] text-slate-400">{s.serviceArea}</p>
                </td>

                <td className="py-4 px-4">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border capitalize ${getApprovalBadge(
                      s.approvalStatus
                    )}`}
                  >
                    {s.approvalStatus}
                  </span>
                </td>

                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {s.approvalStatus !== 'approved' && (
                      <button
                        onClick={() => handleApprovalChange(s, 'approved')}
                        disabled={updatingId === s._id}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                    )}

                    {s.approvalStatus !== 'rejected' && (
                      <button
                        onClick={() => handleApprovalChange(s, 'rejected')}
                        disabled={updatingId === s._id}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 disabled:opacity-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    )}

                    <Link
                      href={`/services/${s._id}`}
                      target="_blank"
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                      title="Inspect Listing"
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
    </div>
  );
}
