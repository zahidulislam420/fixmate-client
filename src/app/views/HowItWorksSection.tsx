import React from 'react';
import { Search, Send, Wrench, CreditCard } from 'lucide-react';

export default function HowItWorksSection() {
  const steps = [
    {
      step: '01',
      title: 'Find a Service',
      desc: 'Browse verified repair listings across smartphones, laptops, ACs, refrigerators, TVs, and electrical works with transparent starting prices.',
      icon: Search,
      badge: 'Step 1',
    },
    {
      step: '02',
      title: 'Send a Request',
      desc: 'Submit your device problem description, contact number, pickup/service address, and preferred booking date in under a minute.',
      icon: Send,
      badge: 'Step 2',
    },
    {
      step: '03',
      title: 'Technician Fixes It',
      desc: 'An expert technician accepts the task, arrives on schedule (or welcomes drop-off), diagnoses the fault, and delivers high-grade repair.',
      icon: Wrench,
      badge: 'Step 3',
    },
    {
      step: '04',
      title: 'Pay After Completion',
      desc: 'Zero upfront risk. Once the repair is marked completed by the technician, review the final amount and pay securely online with Stripe.',
      icon: CreditCard,
      badge: 'Step 4',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100/80 px-3 py-1 rounded-full border border-blue-200">
            Hassle-Free Process
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How FixMate Works
          </h2>
          <p className="mt-3 text-base text-slate-600">
            A secure 4-step workflow engineered so you never have to guess who is handling your device or pay before the job is thoroughly done.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative bg-white rounded-2xl p-7 border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-blue-300 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black text-slate-200 group-hover:text-blue-100 transition-colors">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-xs text-slate-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {item.badge}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
