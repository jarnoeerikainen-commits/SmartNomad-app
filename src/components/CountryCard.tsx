import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Settings, Trash2, RotateCcw, MapPin, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Country } from '@/types/country';
import { useLanguage } from '@/contexts/LanguageContext';

interface CountryCardProps {
  country: Country;
  isCurrentLocation: boolean;
  onRemove: (id: string) => void;
  onUpdateLimit: (id: string, newLimit: number) => void;
  onReset: (id: string) => void;
  onToggleCountDays: (id: string) => void;
}

const CountryCard: React.FC<CountryCardProps> = React.memo(({
  country,
  isCurrentLocation,
  onRemove,
  onUpdateLimit,
  onReset,
  onToggleCountDays
}) => {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [tempLimit, setTempLimit] = useState(country.dayLimit.toString());

  const progress = (country.daysSpent / country.dayLimit) * 100;
  const remainingDays = country.dayLimit - country.daysSpent;
  const taxResidenceDaysLeft = Math.max(0, 183 - country.yearlyDaysSpent);

  const getProgressColor = () => {
    if (progress >= 100) return 'gradient-danger';
    if (progress >= 80) return 'gradient-warning';
    return 'gradient-success';
  };

  const getStatusIcon = () => {
    if (progress >= 100) return <AlertTriangle className="w-5 h-5 text-red-500" />;
    if (progress >= 80) return <AlertTriangle className="w-5 h-5 text-orange-500" />;
    return <CheckCircle className="w-5 h-5 text-green-500" />;
  };

  const getStatusText = () => {
    if (progress >= 100) return t('card.limit_exceeded');
    if (progress >= 90) return t('card.critical');
    if (progress >= 80) return t('card.warning');
    if (progress >= 60) return t('card.monitor');
    return t('card.safe');
  };

  const getStatusVariant = () => {
    if (progress >= 100) return 'destructive';
    if (progress >= 80) return 'secondary';
    return 'default';
  };

  const handleSaveLimit = () => {
    const newLimit = parseInt(tempLimit);
    if (newLimit > 0) {
      onUpdateLimit(country.id, newLimit);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setTempLimit(country.dayLimit.toString());
    setIsEditing(false);
  };

  const isTrackingTaxResidence = country.reason === 'Tax residence tracking';

  return (
    <Card className={`transition-all duration-200 hover:shadow-lg ${
      isCurrentLocation ? 'ring-2 ring-green-400 bg-green-50' : ''
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{country.flag}</div>
            <div>
              <CardTitle className="text-lg">{country.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{country.reason}</p>
              {country.totalEntries > 0 && (
                <p className="text-xs text-blue-600">{t('card.entries')}: {country.totalEntries}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isCurrentLocation && (
              <Badge variant="outline" className="text-green-600 border-green-300">
                <MapPin className="w-3 h-3 mr-1" />
                {t('card.current')}
              </Badge>
            )}
            {getStatusIcon()}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Count Travel Days Toggle */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">{t('card.count_travel_days')}</span>
          </div>
          <Button
            onClick={() => onToggleCountDays(country.id)}
            variant={country.countTravelDays ? "default" : "outline"}
            size="sm"
            className={country.countTravelDays ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {country.countTravelDays ? t('card.on') : t('card.off')}
          </Button>
        </div>

        {/* Tax Residence Status - Only show if tracking tax residence */}
        {isTrackingTaxResidence && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-700">{t('card.tax_residence_status')}</span>
              <Badge variant={taxResidenceDaysLeft < 30 ? "destructive" : "default"} className="text-xs">
                {taxResidenceDaysLeft} {t('card.days_left')}
              </Badge>
            </div>
            <p className="text-xs text-blue-600 mt-1">
              {country.yearlyDaysSpent}/183 {t('card.days_this_year')}
            </p>
          </div>
        )}

        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{t('card.days_progress')}</span>
            <Badge variant={getStatusVariant()}>{getStatusText()}</Badge>
          </div>
          
          <div className="relative">
            <Progress value={Math.min(progress, 100)} className="h-3" />
            <div 
              className={`absolute top-0 left-0 h-3 rounded-full transition-all duration-300 ${getProgressColor()}`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{country.daysSpent} {t('card.days_spent')}</span>
            <span>{remainingDays > 0 ? `${remainingDays} ${t('card.remaining')}` : t('card.limit_exceeded')}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="text-center">
            <p className="text-xl font-bold text-gray-900">{country.daysSpent}</p>
            <p className="text-xs text-gray-600">{t('card.days_spent')}</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-gray-900">{country.dayLimit}</p>
            <p className="text-xs text-gray-600">{t('card.day_limit')}</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-gray-900">{isTrackingTaxResidence ? country.yearlyDaysSpent : country.daysSpent}</p>
            <p className="text-xs text-gray-600">{isTrackingTaxResidence ? t('card.this_year') : t('card.total_days')}</p>
          </div>
        </div>

        {/* Limit Editing */}
        {isEditing ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={tempLimit}
                onChange={(e) => setTempLimit(e.target.value)}
                min="1"
                className="flex-1"
                placeholder="Enter day limit"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSaveLimit} size="sm" className="flex-1">
                {t('common.save')}
              </Button>
              <Button onClick={handleCancelEdit} variant="outline" size="sm" className="flex-1">
                {t('common.cancel')}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <Settings className="w-4 h-4 mr-1" />
              {t('card.edit_limit')}
            </Button>
            <Button
              onClick={() => onReset(country.id)}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              {t('card.reset')}
            </Button>
            <Button
              onClick={() => onRemove(country.id)}
              variant="outline"
              size="sm"
              className="text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

export default CountryCard;
