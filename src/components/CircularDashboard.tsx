import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Country } from '@/types/country';
import { useLanguage } from '@/contexts/LanguageContext';
import TaxResidencyGauge from './TaxResidencyGauge';

interface CircularDashboardProps {
  countries: Country[];
  currentLocation: { country_code: string } | null;
}

const CircularDashboard: React.FC<CircularDashboardProps> = ({ countries, currentLocation }) => {
  const { t } = useLanguage();

  return (
    <Card className="shadow-large border-border/50 bg-card">
      <CardHeader className="text-center pb-6 border-b border-border/50">
        <CardTitle className="text-2xl font-display font-bold text-foreground">
          {t('circularDashboard.title')}
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Premium tax residency monitoring with real-time status indicators
        </p>
      </CardHeader>
      <CardContent className="pt-8">
        {countries.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <div className="text-4xl mb-4">🌍</div>
            <p className="font-medium">No countries tracked yet</p>
            <p className="text-sm mt-2">Add countries to start monitoring your tax residency status</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {countries.map((country) => {
              const isCurrentLocation = currentLocation?.country_code === country.code;
              
              return (
                <div key={country.id} className="animate-scale-in">
                  <TaxResidencyGauge
                    country={country}
                    size="md"
                    showDetails={true}
                    isCurrentLocation={isCurrentLocation}
                  />
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CircularDashboard;
