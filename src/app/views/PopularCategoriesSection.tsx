import React from 'react';
import Link from 'next/link';
import {
  Smartphone,
  Laptop,
  Wind,
  Refrigerator,
  Tv,
  RotateCcw,
  Zap,
  ArrowRight,
} from 'lucide-react';

export default function PopularCategoriesSection() {
  const categories = [
    {
      name: 'Smartphone',
      count: 'Screens, Batteries, Ports',
      icon: Smartphone,
      href: '/services?category=Smartphone',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      name: 'Laptop & PC',
      count: 'Motherboards, RAM, Displays',
      icon: Laptop,
      href: '/services?category=Laptop+%26+PC',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      name: 'AC',
      count: 'Jet Wash, Gas Refill, PCB',
      icon: Wind,
      href: '/services?category=AC',
      color: 'from-cyan-500 to-blue-600',
    },
    {
      name: 'Refrigerator',
      count: 'Compressor, Defrost, Leaks',
      icon: Refrigerator,
      href: '/services?category=Refrigerator',
      color: 'from-violet-500 to-purple-600',
    },
    {
      name: 'TV',
      count: 'LED Backlight, Audio, Panels',
      icon: Tv,
      href: '/services?category=TV',
      color: 'from-amber-500 to-orange-600',
    },
    {
      name: 'Washing Machine',
      count: 'Drums, Motors, Drain Pumps',
      icon: RotateCcw,
      href: '/services?category=Washing+Machine',
      color: 'from-rose-500 to-pink-600',
    },
    {
      name: 'Electrical',
      count: 'DB Box, Wiring, Fixtures',
      icon: Zap,
      href: '/services?category=Electrical',
      color: 'from-yellow-500 to-amber-600',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Browse By Specialty
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Popular Repair Categories
          </h2>
          <p className="mt-2 text-base text-slate-600">
            Choose a department to instantly explore available certified technicians and upfront quotes.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={cat.href}
                className="group relative bg-slate-50 hover:bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${cat.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform mb-4`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{cat.count}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                  <span>Explore fixes</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
