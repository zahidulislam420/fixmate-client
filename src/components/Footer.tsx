import React from 'react';
import Link from 'next/link';
import { Wrench, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Github } from 'lucide-react';

// Custom modern X icon for the latest rebrand
function XLogo({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Footer() {
  const categories = [
    { name: 'Smartphone', href: '/services?category=Smartphone' },
    { name: 'Laptop & PC', href: '/services?category=Laptop+%26+PC' },
    { name: 'Air Conditioner', href: '/services?category=AC' },
    { name: 'Refrigerator', href: '/services?category=Refrigerator' },
    { name: 'Smart TV', href: '/services?category=TV' },
    { name: 'Washing Machine', href: '/services?category=Washing+Machine' },
    { name: 'Electrical Wiring', href: '/services?category=Electrical' },
  ];

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'All Services', href: '/services' },
    { name: 'How It Works / About', href: '/about' },
    { name: 'Sign In', href: '/sign-in' },
    { name: 'Join as Technician', href: '/sign-up' },
  ];

  return (
    <footer className="bg-slate-950 text-slate-300 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                Fix<span className="text-blue-500">Mate</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Bangladesh & worldwide trusted on-demand repair booking platform. Connect with verified
              technicians, track real-time job progress, and pay safely only after quality service.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X (formerly Twitter)"
                className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-600 hover:text-white flex items-center justify-center transition-colors text-slate-400"
              >
                <XLogo className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-600 hover:text-blue-400 flex items-center justify-center transition-colors text-slate-400"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-600 hover:text-pink-400 flex items-center justify-center transition-colors text-slate-400"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-600 hover:text-blue-400 flex items-center justify-center transition-colors text-slate-400"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-600 hover:text-white flex items-center justify-center transition-colors text-slate-400"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Popular Categories
            </h3>
            <ul className="space-y-2.5 text-sm">
              {categories.map((cat) => (
                <li key={cat.name}>
                  <Link
                    href={cat.href}
                    className="text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Contact Support
            </h3>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-1" />
                <span>Level 4, Plot 7, Dhanmondi 27, Dhaka 1209, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-500 shrink-0" />
                <span>+880 (171) 000-FIXM (3496)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                <span>support@fixmate.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} FixMate Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/about" className="hover:text-slate-400 transition-colors">
              Terms of Service
            </Link>
            <Link href="/about" className="hover:text-slate-400 transition-colors">
              Trust & Safety
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
