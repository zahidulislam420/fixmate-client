'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Wrench,
  LayoutDashboard,
  CalendarCheck,
  CreditCard,
  PlusCircle,
  FolderKanban,
  ClipboardList,
  Users,
  CheckSquare,
  Receipt,
  UserCheck,
  Home,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Route protection and reload preservation
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push(`/sign-in?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      // Check role route authorization
      if (pathname.startsWith('/dashboard/admin') && user.role !== 'admin') {
        router.push(user.role === 'technician' ? '/dashboard/technician' : '/dashboard/customer');
      } else if (
        pathname.startsWith('/dashboard/technician') &&
        user.role !== 'technician' &&
        user.role !== 'admin'
      ) {
        router.push('/dashboard/customer');
      } else if (
        pathname.startsWith('/dashboard/customer') &&
        user.role !== 'customer' &&
        user.role !== 'admin'
      ) {
        router.push('/dashboard/technician');
      }
    }
  }, [user, isLoading, pathname, router]);

  // Loading skeleton while checking authentication to prevent premature redirect on reload
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Dynamic menu definitions
  const customerLinks = [
    { label: 'Overview', href: '/dashboard/customer', icon: LayoutDashboard },
    { label: 'My Bookings', href: '/dashboard/customer/bookings', icon: CalendarCheck },
    { label: 'Payment History', href: '/dashboard/customer/payments', icon: CreditCard },
    { label: 'My Profile', href: '/dashboard/profile', icon: UserCheck },
  ];

  const technicianLinks = [
    { label: 'Overview', href: '/dashboard/technician', icon: LayoutDashboard },
    { label: 'Add Service', href: '/dashboard/technician/add-service', icon: PlusCircle },
    { label: 'My Services', href: '/dashboard/technician/my-services', icon: FolderKanban },
    { label: 'Manage Requests', href: '/dashboard/technician/requests', icon: ClipboardList },
    { label: 'My Profile', href: '/dashboard/profile', icon: UserCheck },
  ];

  const adminLinks = [
    { label: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
    { label: 'Manage Users', href: '/dashboard/admin/users', icon: Users },
    { label: 'Service Approvals', href: '/dashboard/admin/services', icon: CheckSquare },
    { label: 'All Bookings', href: '/dashboard/admin/bookings', icon: ClipboardList },
    { label: 'Transactions', href: '/dashboard/admin/transactions', icon: Receipt },
    { label: 'My Profile', href: '/dashboard/profile', icon: UserCheck },
  ];

  let currentNavLinks = customerLinks;
  if (user.role === 'admin') currentNavLinks = adminLinks;
  else if (user.role === 'technician') currentNavLinks = technicianLinks;

  const getRoleBadgeClasses = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'technician':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-200 lg:translate-x-0 lg:static lg:inset-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Wrench className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-xl text-white">
              Fix<span className="text-blue-500">Mate</span>
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card inside Sidebar */}
        <div className="p-4 mx-3 my-4 bg-slate-800/60 rounded-2xl border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-700 border border-slate-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
            {user.image ? (
              <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user.name.slice(0, 2).toUpperCase()
            )}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">{user.name}</p>
            <span
              className={`inline-block px-2 py-0.5 mt-0.5 rounded-full text-[10px] font-bold border capitalize ${getRoleBadgeClasses(
                user.role
              )}`}
            >
              {user.role}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {currentNavLinks.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Utility Bar */}
        <div className="p-3 border-t border-slate-800 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800/80 hover:text-white transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Back to Public Home</span>
          </Link>
          <button
            onClick={() => {
              setSidebarOpen(false);
              logout();
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Dashboard Topbar */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 hidden sm:inline">
              Workspace Portal
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-semibold text-slate-500 hover:text-blue-600 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors hidden sm:inline-flex items-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </Link>

            <div className="h-5 w-px bg-slate-200 hidden sm:block" />

            {/* User Profile Pill */}
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-2.5 p-1 pl-2.5 rounded-full border border-slate-200 hover:border-blue-400 hover:bg-slate-50 transition-all"
            >
              <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center text-blue-600 text-xs font-bold">
                {user.image ? (
                  <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user.name.slice(0, 2).toUpperCase()
                )}
              </div>
              <span className="text-xs font-bold text-slate-800 max-w-[120px] truncate">
                {user.name}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${getRoleBadgeClasses(
                  user.role
                )}`}
              >
                {user.role}
              </span>
            </Link>
          </div>
        </header>

        {/* Dashboard Page View Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
