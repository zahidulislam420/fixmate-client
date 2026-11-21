'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShieldCheck, Clock, Award, ArrowRight } from 'lucide-react';

export default function HeroSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/services?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push('/services');
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50 py-16 sm:py-24 border-b border-slate-200/80">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-35 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text & Search */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/90 text-blue-700 text-xs font-bold border border-blue-200">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>100% Verified Skilled Technicians & Safe Post-Pay</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              Broken Device? Get It Fixed by <span className="text-blue-600">Verified Pros</span>.
            </h1>

            <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
              Book doorstep repair or shop drop-off servicing for smartphones, laptops, ACs, refrigerators, TVs, and home appliances. Pay safely online only after the job is completed.
            </p>

            {/* Quick Search Box */}
            <form onSubmit={handleSearch} className="max-w-xl flex flex-col sm:flex-row gap-2.5 p-2 bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200">
              <div className="flex-1 flex items-center gap-3 px-3">
                <Search className="w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="What needs fixing? (e.g. AC, Screen, Laptop)"
                  className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden py-2"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-blue-500/20 hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <span>Find Services</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-4 max-w-lg border-t border-slate-200/80">
              <div className="flex items-center gap-2 text-slate-700">
                <Award className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-xs font-semibold">Certified Experts</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-xs font-semibold">Realtime Tracking</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-xs font-semibold">Pay After Work</span>
              </div>
            </div>
          </div>

          {/* Right Visual Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 aspect-4/3 sm:aspect-square">
                <img
                  src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=900&auto=format&fit=crop&q=80"
                  alt="Verified electronics repair technician servicing hardware"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                
                <div className="absolute bottom-6 left-6 right-6 text-white p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-blue-300">Average Turnaround</p>
                      <p className="text-xl font-extrabold text-white">Under 3 Hours</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-emerald-300">Customer Rating</p>
                      <p className="text-xl font-extrabold text-white">4.9 / 5.0 ★</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
