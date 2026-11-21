import React from 'react';
import AddServiceForm from './views/AddServiceForm';

export default function AddServicePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Create New Repair Service
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          List a new repair specialty. Submitted services are reviewed by FixMate Admins before going live.
        </p>
      </div>

      <AddServiceForm />
    </div>
  );
}
