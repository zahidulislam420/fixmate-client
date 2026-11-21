import React, { Suspense } from 'react';
import SignInForm from './views/SignInForm';

export default function SignInPage() {
  return (
    <div className="py-12 sm:py-20 flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
      <div className="w-full max-w-md">
        <Suspense
          fallback={
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl animate-pulse h-96" />
          }
        >
          <SignInForm />
        </Suspense>
      </div>
    </div>
  );
}
