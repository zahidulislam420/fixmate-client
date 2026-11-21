'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Service } from '@/types';
import { apiFetch } from '@/lib/api';
import { ArrowRight, MapPin, Tag, Wrench, Clock, Shield, Star } from 'lucide-react';

export default function FeaturedServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const data = await apiFetch<{ success: boolean; services: Service[] }>(
          '/services?featured=6'
        );
        if (data.success && data.services) {
          setServices(data.services);
        }
      } catch (err: any) {
        console.error('Error loading featured services:', err);
        setError('Could not load featured services');
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
              <Wrench className="w-4 h-4" />
              <span>Trending Fixes</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Featured Repair Services
            </h2>
            <p className="mt-2 text-base text-slate-600 max-w-xl">
              Latest approved diagnostic and fix solutions performed by verified local specialists.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 group shrink-0"
          >
            <span>Explore All Services</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 animate-pulse h-[430px] flex flex-col"
              >
                <div className="h-52 bg-slate-200" />
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="h-4 bg-slate-200 rounded-md w-24" />
                    <div className="h-6 bg-slate-200 rounded-md w-4/5" />
                    <div className="h-4 bg-slate-200 rounded-md w-3/5" />
                  </div>
                  <div className="h-10 bg-slate-200 rounded-xl w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
            <p className="text-slate-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold"
            >
              Retry
            </button>
          </div>
        )}

        {/* Services Grid (Equal Height & Width) */}
        {!loading && !error && services.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((item) => (
              <div
                key={item._id}
                className="group flex flex-col h-full bg-white rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-200 overflow-hidden"
              >
                {/* Image Container with fixed height */}
                <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {/* Category Pill */}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-white/95 text-slate-800 shadow-sm backdrop-blur-xs">
                      {item.category}
                    </span>
                  </div>

                  {/* Service Mode Pill */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <span className="flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-full bg-slate-900/80 text-amber-300 shadow-sm backdrop-blur-xs">
                      <Star className="w-3 h-3 fill-amber-300" />
                      <span>4.9</span>
                    </span>
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-600/90 text-white shadow-sm backdrop-blur-xs">
                      {item.serviceMode}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                      <div className="flex items-center gap-1.5 truncate">
                        <Shield className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="font-semibold text-slate-800 truncate">
                          {item.technicianName}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-500 shrink-0">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.estimatedDuration}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block">
                        Starting from
                      </span>
                      <span className="text-2xl font-black text-slate-900">
                        ${item.basePrice}
                      </span>
                    </div>

                    <Link
                      href={`/services/${item._id}`}
                      className="px-4 py-2.5 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
