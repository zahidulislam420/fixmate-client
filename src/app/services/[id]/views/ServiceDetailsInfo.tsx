import React from 'react';
import { Service } from '@/types';
import { Clock, MapPin, Wrench, Shield, CheckCircle } from 'lucide-react';

interface Props {
  service: Service;
}

export default function ServiceDetailsInfo({ service }: Props) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
      {/* Hero Image */}
      <div className="relative h-72 sm:h-96 w-full bg-slate-100">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/95 text-slate-800 shadow-sm backdrop-blur-xs">
            {service.category}
          </span>
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-600 text-white shadow-sm backdrop-blur-xs">
            {service.serviceMode}
          </span>
        </div>
      </div>

      {/* Description & Overview */}
      <div className="p-6 sm:p-10 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {service.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600">
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/60">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Est. Duration: {service.estimatedDuration}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/60">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Coverage: {service.serviceArea}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/60">
              <Wrench className="w-4 h-4 text-blue-600" />
              <span>Mode: {service.serviceMode}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3">
            Service Description & Scope
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
            {service.description}
          </p>
        </div>

        {/* Guarantee Highlights */}
        <div className="border-t border-slate-100 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-slate-800">Genuine Replacement Parts</p>
              <p className="text-[11px] text-slate-500 mt-0.5">OEM standard or manufacturer approved components.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-slate-800">Post-Payment Security</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Payment is processed only after your job is marked complete.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
