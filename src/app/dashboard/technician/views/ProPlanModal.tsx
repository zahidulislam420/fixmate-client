'use client';

import React, { useState } from 'react';
import { Sparkles, Check, X, Shield, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProPlanModal({ isOpen, onClose }: Props) {
  const [upgrading, setUpgrading] = useState(false);
  const [isPro, setIsPro] = useState(false);

  if (!isOpen) return null;

  const handleUpgrade = () => {
    setUpgrading(true);
    setTimeout(() => {
      setUpgrading(false);
      setIsPro(true);
      toast.success('Congratulations! You are now a Verified Pro Technician with unlimited listings.');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 text-center space-y-6">
        <div className="flex justify-end">
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
          <Sparkles className="w-8 h-8" />
        </div>

        <div>
          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-extrabold text-[10px] uppercase border border-amber-200">
            FixMate Pro Technician Plan
          </span>
          <h3 className="text-2xl font-black text-slate-900 mt-2">
            Unlock Unlimited Growth
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Free accounts can list up to 3 services. Upgrade to Pro for unlimited repair listings and verified priority search placement.
          </p>
        </div>

        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 text-left space-y-2.5 text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">Unlimited service catalog listings (vs. 3 max)</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">Golden "Verified Pro" badge on all service cards</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">Top placement on category search results</span>
          </div>
        </div>

        <div className="pt-2">
          <div className="text-3xl font-black text-slate-900 mb-4">
            $19 <span className="text-xs font-semibold text-slate-400">/ month</span>
          </div>
          <button
            onClick={handleUpgrade}
            disabled={upgrading}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
          >
            <span>{upgrading ? 'Activating Pro Plan...' : 'Upgrade with Stripe'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
