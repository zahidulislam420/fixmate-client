import React from 'react';
import HeroSection from './views/HeroSection';
import FeaturedServices from './views/FeaturedServices';
import HowItWorksSection from './views/HowItWorksSection';
import PopularCategoriesSection from './views/PopularCategoriesSection';
import WhyChooseUsSection from './views/WhyChooseUsSection';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <FeaturedServices />
      <HowItWorksSection />
      <PopularCategoriesSection />
      <WhyChooseUsSection />
    </div>
  );
}
