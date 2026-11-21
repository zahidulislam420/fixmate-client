'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Service } from '@/types';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import ServiceDetailsInfo from './views/ServiceDetailsInfo';
import TechnicianProfileCard from './views/TechnicianProfileCard';
import BookingRequestModal from './views/BookingRequestModal';
import { ArrowLeft, ShieldAlert } from 'lucide-react';

function ServiceDetailsContent() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : '';
  const { user } = useAuth();

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    async function loadService() {
      try {
        const res = await apiFetch<{ success: boolean; service: Service }>(
          `/services/${id}`
        );
        if (res.success && res.service) {
          // If not approved/available and user is not admin/owner technician
          if (
            (res.service.approvalStatus !== 'approved' || !res.service.isAvailable) &&
            user?.role !== 'admin' &&
            user?.email !== res.service.technicianEmail
          ) {
            setNotFoundState(true);
          } else {
            setService(res.service);
          }
        } else {
          setNotFoundState(true);
        }
      } catch (err) {
        console.error('Service details fetch error:', err);
        setNotFoundState(true);
      } finally {
        setLoading(false);
      }
    }

    loadService();
  }, [id, user]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="h-6 bg-slate-200 rounded-md w-32 mb-8 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-[500px] bg-slate-200 rounded-3xl animate-pulse" />
          <div className="h-[400px] bg-slate-200 rounded-3xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (notFoundState || !service) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">Service Not Available</h1>
        <p className="mt-3 text-sm text-slate-600 max-w-md mx-auto">
          The requested repair service may have been unlisted, pending moderation, or does not exist.
        </p>
        <Link
          href="/services"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Browse Services</span>
        </Link>
      </div>
    );
  }

  // Handle Repair Request click based on user role
  const handleRequestClick = () => {
    if (!user) {
      router.push(`/sign-in?redirect=${encodeURIComponent(`/services/${service._id}`)}`);
      return;
    }
    if (user.role === 'customer') {
      setModalOpen(true);
    }
  };

  return (
    <div className="py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Services</span>
          </Link>
        </div>

        {/* 2-Column Details Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Info (Left 7 Cols) */}
          <div className="lg:col-span-7">
            <ServiceDetailsInfo service={service} />
          </div>

          {/* Booking Action Box & Tech Profile (Right 5 Cols) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            {/* Booking Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
              <div className="flex items-baseline justify-between mb-4">
                <div>
                  <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                    Base Diagnostic Price
                  </span>
                  <div className="text-4xl font-black text-slate-900 mt-1">
                    ${service.basePrice}
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {service.serviceMode}
                </span>
              </div>

              <div className="space-y-2 py-4 border-y border-slate-100 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Turnaround Time:</span>
                  <span className="font-bold text-slate-800">{service.estimatedDuration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Service Area:</span>
                  <span className="font-bold text-slate-800">{service.serviceArea}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Payment Type:</span>
                  <span className="font-bold text-emerald-600">Pay after completion</span>
                </div>
              </div>

              {/* Role Restricted CTA */}
              <div className="pt-6">
                {!user ? (
                  <button
                    onClick={handleRequestClick}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-blue-500/25 hover:scale-[1.01] transition-all"
                  >
                    Sign In to Request Repair
                  </button>
                ) : user.role === 'customer' ? (
                  <button
                    onClick={handleRequestClick}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-blue-500/25 hover:scale-[1.01] transition-all"
                  >
                    Request Repair Now
                  </button>
                ) : (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center">
                    <p className="text-xs font-bold text-slate-600">
                      Only customers can request a repair.
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Logged in as {user.role} ({user.email})
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Technician Profile Card */}
            <TechnicianProfileCard service={service} />
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {service && (
        <BookingRequestModal
          service={service}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={() => setModalOpen(true)}
        />
      )}
    </div>
  );
}

export default function ServiceDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="h-6 bg-slate-200 rounded-md w-32 mb-8 animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-[500px] bg-slate-200 rounded-3xl animate-pulse" />
            <div className="h-[400px] bg-slate-200 rounded-3xl animate-pulse" />
          </div>
        </div>
      }
    >
      <ServiceDetailsContent />
    </Suspense>
  );
}
