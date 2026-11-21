'use client';

import React, { useState } from 'react';
import { User, UserRole } from '@/types';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';
import { Shield, ShieldAlert, UserCheck, Calendar } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface Props {
  users: User[];
  onRefresh: () => void;
}

export default function AdminUsersTable({ users, onRefresh }: Props) {
  const { user: currentUser } = useAuth();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'technician':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const handleRoleChange = async (targetUser: User, newRole: UserRole) => {
    if (targetUser.email === currentUser?.email) {
      toast.error('Forbidden: Admins cannot change their own role');
      return;
    }

    setUpdatingId(targetUser.id);
    try {
      const res = await apiFetch<{ success: boolean; message: string }>(
        `/admin/users/${targetUser.id}/role`,
        {
          method: 'PATCH',
          body: JSON.stringify({ role: newRole }),
        }
      );

      if (res.success) {
        toast.success(`Role for ${targetUser.name} updated to ${newRole}`);
        onRefresh();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update user role');
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
              <th className="py-4 px-6">User Profile</th>
              <th className="py-4 px-4">Contact</th>
              <th className="py-4 px-4">Current Role</th>
              <th className="py-4 px-4">Joined Date</th>
              <th className="py-4 px-6 text-right">Role Management</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {users.map((u) => {
              const isSelf = u.email === currentUser?.email;
              return (
                <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center font-bold text-blue-600">
                        {u.image ? (
                          <img src={u.image} alt={u.name} className="w-full h-full object-cover" />
                        ) : (
                          u.name.slice(0, 2).toUpperCase()
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">
                          {u.name} {isSelf && <span className="text-[10px] text-purple-600 font-extrabold">(You)</span>}
                        </p>
                        <p className="text-xs text-slate-400">{u.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-slate-600">
                    <p className="font-medium">{u.phone || 'No phone set'}</p>
                    <p className="text-[11px] text-slate-400">{u.area || 'No area set'}</p>
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border capitalize ${getRoleBadge(
                        u.role
                      )}`}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-slate-500">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                  </td>

                  <td className="py-4 px-6 text-right">
                    {isSelf ? (
                      <span className="text-[11px] text-slate-400 italic">
                        Self role protected
                      </span>
                    ) : (
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u, e.target.value as UserRole)}
                        disabled={updatingId === u.id}
                        className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                      >
                        <option value="customer">Customer</option>
                        <option value="technician">Technician</option>
                        <option value="admin">Admin</option>
                      </select>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
