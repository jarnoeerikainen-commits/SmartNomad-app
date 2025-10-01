
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Country } from '@/types/country';

interface CircularDashboardProps {
  countries: Country[];
  currentLocation: { country_code: string } | null;
}

const CircularDashboard: React.FC<CircularDashboardProps> = ({ countries, currentLocation }) => {
  const getProgressColor = (progress: number) => {
    if (progress >= 100) return '#ef4444'; // red
    if (progress >= 80) return '#f59e0b'; // orange
    return '#10b981'; // green
  };

  const getStrokeColor = (progress: number) => {
    if (progress >= 100) return '#fca5a5'; // light red
    if (progress >= 80) return '#fde68a'; // light orange
    return '#86efac'; // light green
  };

  const radius = 45;
  const circumference = 2 * Math.PI * radius;

  return (
    <Card className="gradient-hero shadow-medium">
      <CardHeader className="text-center pb-3">
        <CardTitle className="text-xl font-bold gradient-primary bg-clip-text text-transparent">
          Countries at a Glance
        </CardTitle>
      </CardHeader>
      <CardContent>
        {countries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No countries tracked yet
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {countries.map((country) => {
              const progress = (country.daysSpent / country.dayLimit) * 100;
              const strokeDasharray = circumference;
              const strokeDashoffset = circumference - (Math.min(progress, 100) / 100) * circumference;
              const isCurrentLocation = currentLocation?.country_code === country.code;

              return (
                <div
                  key={country.id}
                  className={`relative flex flex-col items-center p-4 rounded-lg transition-all duration-200 ${
                    isCurrentLocation ? 'bg-success/20 ring-2 ring-success' : 'bg-card'
                  } hover:shadow-medium`}
                >
                  {/* Circular Progress */}
                  <div className="relative w-24 h-24 mb-3">
                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                      {/* Background circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        stroke={getStrokeColor(progress)}
                        strokeWidth="8"
                        fill="none"
                        className="opacity-30"
                      />
                      {/* Progress circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        stroke={getProgressColor(progress)}
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-500"
                      />
                    </svg>
                    
                    {/* Center content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-2xl mb-1">{country.flag}</div>
                      <div className="text-xs font-bold text-gray-800">
                        {country.daysSpent}/{country.dayLimit}
                      </div>
                    </div>
                  </div>

                  {/* Country info */}
                  <div className="text-center">
                    <h3 className="font-semibold text-sm text-gray-800 mb-1">
                      {country.name}
                    </h3>
                    <div className="text-xs text-gray-600 mb-2">
                      {country.dayLimit - country.daysSpent > 0 
                        ? `${country.dayLimit - country.daysSpent} days left`
                        : 'Limit exceeded'
                      }
                    </div>
                    
                    {/* Status badges */}
                    <div className="flex flex-col gap-1">
                      {isCurrentLocation && (
                        <Badge variant="outline" className="text-success border-success text-xs py-0">
                          Current
                        </Badge>
                      )}
                      {!country.countTravelDays && (
                        <Badge variant="secondary" className="text-muted-foreground text-xs py-0">
                          Not Counting
                        </Badge>
                      )}
                    </div>
                  </div>
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
