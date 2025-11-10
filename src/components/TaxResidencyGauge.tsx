import React from 'react';
import { Country } from '@/types/country';

interface TaxResidencyGaugeProps {
  country: Country;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  isCurrentLocation?: boolean;
}

const TaxResidencyGauge: React.FC<TaxResidencyGaugeProps> = ({
  country,
  size = 'md',
  showDetails = true,
  isCurrentLocation = false
}) => {
  const progress = Math.min((country.daysSpent / country.dayLimit) * 100, 100);
  
  // Size configurations
  const sizeConfig = {
    sm: { gauge: 80, stroke: 6, text: 'text-xs', days: 'text-lg', flag: 'text-xl' },
    md: { gauge: 120, stroke: 8, text: 'text-sm', days: 'text-2xl', flag: 'text-3xl' },
    lg: { gauge: 160, stroke: 10, text: 'text-base', days: 'text-3xl', flag: 'text-4xl' }
  };

  const config = sizeConfig[size];
  const radius = (config.gauge - config.stroke * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Status determination with elegant color scheme
  const getStatus = () => {
    if (progress >= 100) return {
      color: 'hsl(var(--danger))',
      gradient: 'var(--gradient-danger)',
      shadow: 'var(--shadow-glow-danger)',
      label: 'Limit Exceeded',
      bgClass: 'bg-danger/10'
    };
    if (progress >= 90) return {
      color: 'hsl(var(--warning))',
      gradient: 'var(--gradient-warning)',
      shadow: 'var(--shadow-glow-warning)',
      label: 'Critical',
      bgClass: 'bg-warning/10'
    };
    if (progress >= 75) return {
      color: 'hsl(var(--warning))',
      gradient: 'var(--gradient-warning)',
      shadow: 'var(--shadow-glow-warning)',
      label: 'Caution',
      bgClass: 'bg-warning/10'
    };
    return {
      color: 'hsl(var(--success))',
      gradient: 'var(--gradient-success)',
      shadow: 'var(--shadow-glow-success)',
      label: 'Safe',
      bgClass: 'bg-success/10'
    };
  };

  const status = getStatus();
  const daysRemaining = Math.max(country.dayLimit - country.daysSpent, 0);

  return (
    <div 
      className={`relative flex flex-col items-center justify-center transition-smooth hover-lift ${
        isCurrentLocation ? 'ring-2 ring-primary/30 rounded-2xl p-4' : ''
      }`}
    >
      {/* Circular Gauge */}
      <div className="relative" style={{ width: config.gauge, height: config.gauge }}>
        <svg
          className="transform -rotate-90 transition-smooth"
          width={config.gauge}
          height={config.gauge}
          viewBox={`0 0 ${config.gauge} ${config.gauge}`}
        >
          {/* Background ring */}
          <circle
            cx={config.gauge / 2}
            cy={config.gauge / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={config.stroke}
            opacity="0.2"
          />
          
          {/* Progress ring with gradient */}
          <defs>
            <linearGradient id={`gradient-${country.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={status.color} stopOpacity="1" />
              <stop offset="100%" stopColor={status.color} stopOpacity="0.7" />
            </linearGradient>
          </defs>
          
          <circle
            cx={config.gauge / 2}
            cy={config.gauge / 2}
            r={radius}
            fill="none"
            stroke={`url(#gradient-${country.id})`}
            strokeWidth={config.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="status-indicator"
            style={{
              filter: `drop-shadow(0 0 8px ${status.color})`
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`${config.flag} mb-1`}>{country.flag}</div>
          <div className={`${config.days} font-bold font-display`} style={{ color: status.color }}>
            {country.daysSpent}
          </div>
          <div className={`${config.text} text-muted-foreground font-medium`}>
            of {country.dayLimit}
          </div>
        </div>
      </div>

      {/* Country details */}
      {showDetails && (
        <div className="mt-4 text-center space-y-2 animate-fade-in">
          <h3 className="font-semibold text-foreground font-display">
            {country.name}
          </h3>
          
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${status.bgClass} border border-current`}>
            <div 
              className="w-2 h-2 rounded-full animate-glow"
              style={{ backgroundColor: status.color }}
            />
            <span className={`${config.text} font-medium`} style={{ color: status.color }}>
              {status.label}
            </span>
          </div>

          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex flex-col items-center">
              <span className="font-bold text-foreground">{daysRemaining}</span>
              <span className="text-xs">Days Left</span>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="flex flex-col items-center">
              <span className="font-bold text-foreground">{Math.round(progress)}%</span>
              <span className="text-xs">Used</span>
            </div>
          </div>

          {isCurrentLocation && (
            <div className="flex items-center gap-1 text-xs text-primary font-medium animate-scale-in">
              <div className="w-2 h-2 rounded-full bg-primary animate-glow" />
              Current Location
            </div>
          )}

          {!country.countTravelDays && (
            <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              Not Counting Days
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaxResidencyGauge;
