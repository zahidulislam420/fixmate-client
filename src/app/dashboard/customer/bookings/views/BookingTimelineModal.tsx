import React from 'react';
import { Booking } from '@/types';
import { X, CheckCircle2, Clock, Check, AlertCircle } from 'lucide-react';

interface Props {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

const PIPELINE_STAGES = [
  { key: 'requested', label: 'Requested' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'in-progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
  { key: 'paid', label: 'Paid' },
];

export default function BookingTimelineModal({
  booking,
  isOpen,
  onClose,
}: Props) {
  if (!isOpen || !booking) return null;

  // Determine stage progress
  const getStageIndex = () => {
    if (booking.status === 'cancelled' || booking.status === 'rejected') return -1;
    if (booking.paymentStatus === 'paid') return 4;
    if (booking.status === 'completed') return 3;
    if (booking.status === 'in-progress') return 2;
    if (booking.status === 'accepted') return 1;
    return 0; // requested
  };

  const currentIndex = getStageIndex();
  const isTerminated = booking.status === 'cancelled' || booking.status === 'rejected';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">Job Progress Tracker</h3>
            <p className="text-xs text-slate-500 mt-0.5">{booking.serviceTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isTerminated ? (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-center mb-6">
            <AlertCircle className="w-8 h-8 text-rose-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-rose-800 capitalize">
              Job {booking.status}
            </p>
            <p className="text-xs text-rose-600 mt-0.5">
              This repair request was {booking.status} and no further stages will occur.
            </p>
          </div>
        ) : (
          <div className="relative py-4 mb-6">
            <div className="flex items-center justify-between relative z-10">
              {PIPELINE_STAGES.map((stg, i) => {
                const isPassed = i <= currentIndex;
                const isCurrent = i === currentIndex;
                return (
                  <div key={stg.key} className="flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors shadow-xs ${
                        isPassed
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 border border-slate-300 text-slate-400'
                      }`}
                    >
                      {isPassed ? <Check className="w-4 h-4" /> : i + 1}
                    </div>
                    <span
                      className={`text-[10px] mt-2 font-bold text-center ${
                        isCurrent
                          ? 'text-blue-600'
                          : isPassed
                          ? 'text-slate-800'
                          : 'text-slate-400'
                      }`}
                    >
                      {stg.label}
                    </span>
                  </div>
                );
              })}
            </div>
            {/* Connecting bar */}
            <div className="absolute top-8.5 left-4 right-4 h-0.5 bg-slate-200 -z-0" />
          </div>
        )}

        {/* Status History Logs */}
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Status Activity Log
          </p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {booking.statusHistory && booking.statusHistory.length > 0 ? (
              booking.statusHistory.map((h, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-slate-800 capitalize">{h.status}</span>
                    {h.note && <p className="text-[11px] text-slate-500 mt-0.5">{h.note}</p>}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {new Date(h.changedAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400">No detailed logs recorded.</p>
            )}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
          >
            Close Tracker
          </button>
        </div>
      </div>
    </div>
  );
}
