'use client';

import React, { useState } from 'react';
import { Booking } from '@/types';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';
import { Star, X } from 'lucide-react';

interface Props {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReviewModal({
  booking,
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const [rating, setRating] = useState<number>(5);
  const [review, setReview] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !booking) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await apiFetch<{ success: boolean; message: string }>(
        `/bookings/${booking._id}/review`,
        {
          method: 'POST',
          body: JSON.stringify({ rating, review }),
        }
      );

      if (res.success) {
        toast.success('Thank you! Your review has been recorded.');
        onSuccess();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">Rate & Review</h3>
            <p className="text-xs text-slate-500 mt-0.5">{booking.serviceTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              How was your service experience?
            </span>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-200'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-amber-600 mt-2 block">
              {rating === 5 ? 'Excellent 5/5' : `${rating} Stars`}
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Review Comments (Optional)
            </label>
            <textarea
              rows={3}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Tell others how prompt and professional the technician was..."
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
