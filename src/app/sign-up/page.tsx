import React from 'react';
import SignUpForm from './views/SignUpForm';

export default function SignUpPage() {
  return (
    <div className="py-12 sm:py-20 flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
      <div className="w-full max-w-md">
        <SignUpForm />
      </div>
    </div>
  );
}
