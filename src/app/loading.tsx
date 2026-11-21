import React from 'react';

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="h-44 bg-slate-200/80 rounded-3xl w-full" />

      {/* Grid of 6 Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-80 bg-white border border-slate-200 rounded-3xl p-5 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="h-40 bg-slate-200 rounded-2xl w-full" />
              <div className="h-4 bg-slate-200 rounded-md w-3/4" />
              <div className="h-3 bg-slate-200 rounded-md w-1/2" />
            </div>
            <div className="h-9 bg-slate-200 rounded-xl w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
