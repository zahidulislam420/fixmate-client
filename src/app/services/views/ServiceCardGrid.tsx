import React from 'react';
import Link from 'next/link';
import { Service } from '@/types';
import { MapPin, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

interface Props {
  services: Service[];
}

export default function ServiceCardGrid({ services }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {services.map((item) => (
        <div
          key={item._id}
          className="group flex flex-col h-full bg-white rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-200 overflow-hidden"
        >
          {/* Image Banner */}
          <div className="relative h-48 w-full overflow-hidden bg-slate-100">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            {/* Category Badge */}
            <div className="absolute top-3 left-3">
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-white/95 text-slate-800 shadow-sm backdrop-blur-xs">
                {item.category}
              </span>
            </div>

            {/* Service Mode Badge */}
            <div className="absolute top-3 right-3">
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-600/90 text-white shadow-sm backdrop-blur-xs">
                {item.serviceMode}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                {item.title}
              </h3>
              <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {item.description}
              </p>

              {/* Service Details & Area */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center gap-1.5 truncate">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="font-semibold text-slate-800 truncate">
                      {item.technicianName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500 shrink-0">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.estimatedDuration}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-slate-500 truncate">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{item.serviceArea}</span>
                </div>
              </div>
            </div>

            {/* Price & Action */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Starting Price
                </span>
                <span className="text-xl font-black text-slate-900">
                  ${item.basePrice}
                </span>
              </div>

              <Link
                href={`/services/${item._id}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
              >
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
