import React from 'react';
import { ShieldCheck, Award, HeartHandshake, CheckCircle2, Star } from 'lucide-react';

export default function WhyChooseUsSection() {
  const stats = [
    { value: '1,450+', label: 'Successful Repairs' },
    { value: '180+', label: 'Verified Technicians' },
    { value: '99.4%', label: 'Satisfaction Rate' },
    { value: '100%', label: 'Post-Pay Protection' },
  ];

  const trustPoints = [
    {
      title: 'Zero Prepayment Risk',
      desc: 'You only pay through Stripe after the technician marks the job completed and you verify the outcome.',
      icon: ShieldCheck,
    },
    {
      title: 'Background-Checked Pros',
      desc: 'Every technician profile and service listing is carefully vetted and approved by our admin team.',
      icon: Award,
    },
    {
      title: 'Real-Time Job Pipeline',
      desc: 'Track your booking status step by step: Requested ➔ Accepted ➔ In Progress ➔ Completed ➔ Paid.',
      icon: CheckCircle2,
    },
    {
      title: 'Direct Doorstep & Drop-off Modes',
      desc: 'Choose between convenient Home Visit diagnostics or drop off your device at an authorized service shop.',
      icon: HeartHandshake,
    },
  ];

  const testimonials = [
    {
      quote:
        'My MacBook Pro had severe motherboard issues after a liquid spill. Tanvir repaired it within 24 hours at half the official service price. Fantastic experience!',
      name: 'Sarah Rahman',
      location: 'Mirpur, Dhaka',
      rating: 5,
    },
    {
      quote:
        'Hasan arrived right on time for our split AC master cleaning and gas refill. The cooling is icy cold again and paying online through Stripe after completion was seamless.',
      name: 'Karim Chowdhury',
      location: 'Uttara, Dhaka',
      rating: 5,
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Platform Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-16 border-b border-slate-800 text-center">
          {stats.map((s) => (
            <div key={s.label} className="p-4">
              <p className="text-3xl sm:text-5xl font-black text-blue-400 tracking-tight">
                {s.value}
              </p>
              <p className="mt-2 text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wider">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Why Choose Us Trust Pillars */}
        <div className="pt-16 pb-12">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950 px-3 py-1 rounded-full border border-blue-800">
              The FixMate Standard
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Why Customers Rely on FixMate
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Built specifically to eliminate the anxiety and mistrust traditionally associated with appliance repairs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustPoints.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 hover:border-blue-500/60 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-white">{item.title}</h3>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Testimonials */}
        <div className="pt-12 border-t border-slate-800">
          <h3 className="text-center text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">
            Verified Customer Reviews
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-slate-800/50 rounded-2xl p-6 border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-300 italic leading-relaxed">
                    "{t.quote}"
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{t.name}</span>
                  <span className="text-slate-500">{t.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
