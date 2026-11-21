import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';

interface Props {
  onReset: () => void;
}

export default function EmptyState({ onReset }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-xs">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
        <SearchX className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-slate-900">No Services Found</h3>
      <p className="mt-2 text-xs text-slate-500 leading-relaxed">
        We couldn't find any approved repair services matching your specific search criteria or active filters. Try adjusting your search query or resetting filters.
      </p>
      <button
        onClick={onReset}
        className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
      >
        <RotateCcw className="w-4 h-4" />
        <span>Clear All Filters</span>
      </button>
    </div>
  );
}
