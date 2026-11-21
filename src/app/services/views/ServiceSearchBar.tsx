'use client';

import React from 'react';
import { Search, X, Sparkles } from 'lucide-react';

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClear: () => void;
}

const POPULAR_SEARCHES = ['AC Cleaning', 'iPhone Screen', 'Laptop Motherboard', 'Refrigerator', 'Short Circuit'];

export default function ServiceSearchBar({
  search,
  onSearchChange,
  onSubmit,
  onClear,
}: Props) {
  return (
    <div className="space-y-3">
      <form onSubmit={onSubmit} className="relative flex-1">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search repair services by device, issue, or city area..."
            className="w-full pl-12 pr-24 py-3 bg-white rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-20 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
          >
            Search
          </button>
        </div>
      </form>

      {/* Popular quick chips */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span className="font-semibold text-slate-400 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span>Quick:</span>
        </span>
        {POPULAR_SEARCHES.map((query) => (
          <button
            key={query}
            type="button"
            onClick={() => onSearchChange(query)}
            className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-[11px] font-semibold text-slate-600 transition-colors"
          >
            {query}
          </button>
        ))}
      </div>
    </div>
  );
}
