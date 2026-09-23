import React from 'react';
import { Country } from '@/types/country';
import MorningBriefing from '@/components/dashboard/MorningBriefing';

interface HomeSectionProps {
  countries: Country[];
  onNavigate: (section: string) => void;
}

const HomeSection: React.FC<HomeSectionProps> = ({ countries, onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto pb-24 md:pb-6 px-0">
      <MorningBriefing countries={countries} onNavigate={onNavigate} />
    </div>
  );
};

export default HomeSection;
