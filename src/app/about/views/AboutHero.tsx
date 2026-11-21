import React from 'react';
import { ShieldCheck, Target, Users, Sparkles } from 'lucide-react';

export default function AboutHero() {
  return (
    <div className="py-16 sm:py-20 bg-gradient-to-b from-blue-50/70 to-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100/90 px-3 py-1 rounded-full border border-blue-200">
            About FixMate
          </span>
          <h1 className="mt-4 text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Transforming Device & Appliance Repairs into a <span className="text-blue-600">Trust-First Experience</span>.
          </h1>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            In Bangladesh and across the world, people struggle to find a trustworthy repair technician. Devices get handed over with no progress visibility, and payments are demanded before work is tested. FixMate solves both sides of the marketplace: every job has a real-time status pipeline, and customers pay only after complete satisfaction.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <Target className="w-6 h-6 text-blue-600 mb-3" />
            <h3 className="font-bold text-slate-900 text-base">Our Mission</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Empower independent skilled technicians with a professional booking pipeline while giving customers 100% peace of mind.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <ShieldCheck className="w-6 h-6 text-emerald-600 mb-3" />
            <h3 className="font-bold text-slate-900 text-base">Verified Quality</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Every technician profile and service catalog listing undergoes admin moderation before public listing.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <Users className="w-6 h-6 text-purple-600 mb-3" />
            <h3 className="font-bold text-slate-900 text-base">Open Marketplace</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              From mobile screens to heavy ACs and refrigerators, transparent pricing and direct doorstep servicing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
