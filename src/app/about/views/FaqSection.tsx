import React from 'react';
import { HelpCircle } from 'lucide-react';

export default function FaqSection() {
  const faqs = [
    {
      q: 'When do I pay for the repair?',
      a: 'You never pay in advance on FixMate. Once the technician completes the repair and marks it completed in the system, a Pay Now button appears in your dashboard to securely settle via Stripe.',
    },
    {
      q: 'Can I cancel a repair request?',
      a: 'Yes, you can cancel your request anytime while it is in the "Requested" status directly from your My Bookings dashboard.',
    },
    {
      q: 'How does a technician list services?',
      a: 'Technicians register with the Technician role, then add services with photos uploaded via ImgBB. Services remain pending until approved by a FixMate Admin.',
    },
    {
      q: 'What if a technician changes the price?',
      a: 'When marking a job completed, technicians submit the final amount reflecting any additional genuine spare parts required. This amount is reviewed and approved by you before making payment.',
    },
  ];

  return (
    <div className="py-16 sm:py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
            <HelpCircle className="w-4 h-4" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((f) => (
            <div
              key={f.q}
              className="p-6 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2"
            >
              <h3 className="font-bold text-base text-slate-900">{f.q}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
