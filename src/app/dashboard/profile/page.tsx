import React from 'react';
import ProfileForm from './views/ProfileForm';

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Account Settings & Profile
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your contact details, service coverage area, and profile picture.
        </p>
      </div>

      <ProfileForm />
    </div>
  );
}
