import React from 'react';
import AboutHero from './views/AboutHero';
import FaqSection from './views/FaqSection';
import HowItWorksSection from '../views/HowItWorksSection';

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      <AboutHero />
      <HowItWorksSection />
      <FaqSection />
    </div>
  );
}
