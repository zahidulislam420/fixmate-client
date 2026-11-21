'use client';

import React, { useEffect, useState } from 'react';
import { User } from '@/types';
import { apiFetch } from '@/lib/api';
import AdminUsersTable from './views/AdminUsersTable';
import { Users } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await apiFetch<{ success: boolean; users: User[] }>('/admin/users');
      if (res.success && res.users) {
        setUsers(res.users);
      }
    } catch (err) {
      console.error('Failed to load admin users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-600" />
          <span>User & Role Governance</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Promote or adjust stakeholder permissions across Customer, Technician, and Admin levels.
        </p>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <AdminUsersTable users={users} onRefresh={fetchUsers} />
      )}
    </div>
  );
}
