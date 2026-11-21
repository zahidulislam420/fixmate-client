import React, { Suspense } from 'react';
import PaymentSuccessCard from './views/PaymentSuccessCard';

export default function PaymentSuccessPage() {
  return (
    <div className="py-16 sm:py-24 px-4 min-h-[calc(100vh-80px)] flex items-center justify-center">
      <Suspense
        fallback={
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        }
      >
        <PaymentSuccessCard />
      </Suspense>
    </div>
  );
}
