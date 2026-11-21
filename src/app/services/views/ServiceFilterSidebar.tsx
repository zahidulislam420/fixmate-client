'use client';

import React from 'react';
import { Filter, ArrowUpDown, RotateCcw } from 'lucide-react';
import { ServiceCategory, ServiceMode } from '@/types';

interface Props {
  selectedCategory: string;
  selectedMode: string;
  selectedSort: string;
  onCategoryChange: (cat: string) => void;
  onModeChange: (mode: string) => void;
  onSortChange: (sort: string) => void;
  onReset: () => void;
}

const CATEGORIES: { label: string; value: string }[] = [
  { label: 'All Categories', value: 'All' },
  { label: 'Smartphone', value: 'Smartphone' },
  { label: 'Laptop & PC', value: 'Laptop & PC' },
  { label: 'AC', value: 'AC' },
  { label: 'Refrigerator', value: 'Refrigerator' },
  { label: 'TV', value: 'TV' },
  { label: 'Washing Machine', value: 'Washing Machine' },
  { label: 'Electrical', value: 'Electrical' },
];

const SERVICE_MODES: { label: string; value: string }[] = [
  { label: 'All Modes', value: 'All' },
  { label: 'Home Visit', value: 'Home Visit' },
  { label: 'Shop Drop-off', value: 'Shop Drop-off' },
];

const SORT_OPTIONS: { label: string; value: string }[] = [
  { label: 'Newest Additions', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
];

export default function ServiceFilterSidebar({
  selectedCategory,
  selectedMode,
  selectedSort,
  onCategoryChange,
  onModeChange,
  onSortChange,
  onReset,
}: Props) {
  const hasActiveFilters =
    selectedCategory !== 'All' || selectedMode !== 'All' || selectedSort !== 'newest';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
          <Filter className="w-4 h-4 text-blue-600" />
          <span>Filters & Sort</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Sort Dropdown */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span>Sort By</span>
        </label>
        <select
          value={selectedSort}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          Category
        </label>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => onCategoryChange(cat.value)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/80 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span>{cat.label}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Service Mode Filter */}
      <div className="pt-4 border-t border-slate-100">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          Service Mode
        </label>
        <div className="space-y-1">
          {SERVICE_MODES.map((mode) => {
            const isSelected = selectedMode === mode.value;
            return (
              <button
                key={mode.value}
                onClick={() => onModeChange(mode.value)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/80 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span>{mode.label}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
