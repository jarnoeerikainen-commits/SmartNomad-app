import React from 'react';
import { Country } from '@/types/country';
import { Subscription } from '@/types/subscription';
import DashboardHeroCards from '@/components/dashboard/DashboardHeroCards';
import { useLanguage } from '@/contexts/LanguageContext';

interface HomeSectionProps {
  countries: Country[];
  subscription: Subscription;
  onNavigate: (section: string) => void;
}

const HomeSection: React.FC<HomeSectionProps> = ({ countries, subscription, onNavigate }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-24 md:pb-6">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Welcome to SuperNomad
        </h1>
        <p className="text-lg text-muted-foreground">
          Your AI-powered global community. Connect smarter, discover easier, thrive faster.
        </p>
      </div>
      
      <DashboardHeroCards onNavigate={onNavigate} />
    </div>
  );
};

export default HomeSection;
