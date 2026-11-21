import React from 'react';
import { Service } from '@/types';
import { ShieldCheck, MapPin, Award, Mail, Phone } from 'lucide-react';

interface Props {
  service: Service;
}

export default function TechnicianProfileCard({ service }: Props) {
  const tech = service.technician;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600">
        <ShieldCheck className="w-4 h-4" />
        <span>Assigned Specialist</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
          {tech?.image ? (
            <img
              src={tech.image}
              alt={service.technicianName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-700 font-extrabold text-lg">
              {service.technicianName.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>

        <div>
          <h4 className="text-lg font-extrabold text-slate-900">
            {service.technicianName}
          </h4>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{tech?.area || service.serviceArea}</span>
          </div>
          <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200 uppercase">
            FixMate Certified Technician
          </span>
        </div>
      </div>

      {/* Bio */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 leading-relaxed">
        <p className="font-semibold text-slate-800 mb-1">About the Technician:</p>
        <p>{tech?.bio || 'Experienced technician with certified expertise in domestic appliances and hardware fixes.'}</p>
      </div>

      {/* Trust credentials */}
      <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Identity & background verified by FixMate Admin</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Payment released only upon customer satisfaction</span>
        </div>
      </div>
    </div>
  );
}
