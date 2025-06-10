
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink, Calendar, User, GraduationCap, Building, Scale } from 'lucide-react';
import CountryInfoService from '@/services/CountryInfoService';
import { CountryDetails } from '@/types/countryInfo';

interface TrackingRecommendationsProps {
  countries: any[];
  onAddCountry: (country: any) => void;
}

const TrackingRecommendations: React.FC<TrackingRecommendationsProps> = ({ countries, onAddCountry }) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryDetails | null>(null);
  const [userType, setUserType] = useState<'tourist' | 'student' | 'expat' | 'business' | 'tax'>('tourist');

  const allCountries = CountryInfoService.getAllCountries();

  const getTrackingReasons = () => {
    const reasons = [];
    
    switch (userType) {
      case 'tourist':
        reasons.push(
          { reason: 'Tourist visa limit', description: 'Track tourist visa-free days', icon: Calendar },
          { reason: 'Schengen area limit', description: '90 days in 180-day period for Schengen', icon: Calendar }
        );
        break;
      case 'student':
        reasons.push(
          { reason: 'Study permit validity', description: 'Track study permit duration', icon: GraduationCap },
          { reason: 'Work rights while studying', description: 'Monitor work permission limits', icon: Building },
          { reason: 'Post-graduation work rights', description: 'Track post-study work permit days', icon: User }
        );
        break;
      case 'expat':
        reasons.push(
          { reason: 'Residency requirement', description: 'Track days for residency status', icon: User },
          { reason: 'Permanent residency path', description: 'Monitor PR qualification days', icon: Building },
          { reason: 'Citizenship eligibility', description: 'Track citizenship requirement days', icon: Scale }
        );
        break;
      case 'business':
        reasons.push(
          { reason: 'Business travel limit', description: 'Track business visa-free days', icon: Building },
          { reason: 'Work permit limit', description: 'Monitor work authorization validity', icon: Calendar },
          { reason: 'Corporate tax residency', description: 'Track business tax obligations', icon: Scale }
        );
        break;
      case 'tax':
        reasons.push(
          { reason: 'Tax residence tracking', description: 'Monitor tax residency thresholds', icon: Scale },
          { reason: 'Double taxation treaties', description: 'Track treaty benefit eligibility', icon: Building },
          { reason: 'Substantial presence test', description: 'US tax residency calculation', icon: Calendar }
        );
        break;
    }
    
    return reasons;
  };

  const getRecommendedDayLimit = (country: CountryDetails, reason: string) => {
    switch (reason) {
      case 'Tourist visa limit':
        return country.visaFreeStays.tourist;
      case 'Business travel limit':
        return country.visaFreeStays.business;
      case 'Tax residence tracking':
        return country.taxResidencyDays;
      case 'Schengen area limit':
        return 90;
      case 'Study permit validity':
        return country.studentInfo?.maxStudyDays || 365;
      case 'Residency requirement':
        return country.expatInfo?.residencyRequirementDays || 183;
      case 'Permanent residency path':
        return country.expatInfo?.permanentResidencyDays || 1095; // 3 years
      case 'Citizenship eligibility':
        return country.expatInfo?.citizenshipRequirementDays || 1825; // 5 years
      case 'Work permit limit':
        return 365;
      default:
        return country.visaFreeStays.tourist;
    }
  };

  const handleAddCountryWithReason = (country: CountryDetails, reason: string) => {
    const dayLimit = getRecommendedDayLimit(country, reason);
    
    onAddCountry({
      code: country.code,
      name: country.name,
      flag: country.flag,
      reason: reason,
      dayLimit: dayLimit
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Tracking Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={userType} onValueChange={(value) => setUserType(value as any)}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="tourist">Tourist</TabsTrigger>
            <TabsTrigger value="student">Student</TabsTrigger>
            <TabsTrigger value="expat">Expat</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="tax">Tax</TabsTrigger>
          </TabsList>
          
          <div className="mt-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3">Recommended Tracking for {userType.charAt(0).toUpperCase() + userType.slice(1)}</h3>
              <div className="grid gap-3">
                {getTrackingReasons().map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <Icon className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">{item.reason}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Popular Countries for {userType.charAt(0).toUpperCase() + userType.slice(1)}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {allCountries.slice(0, 6).map((country) => (
                  <Card key={country.code} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{country.flag}</span>
                        <div>
                          <p className="font-medium">{country.name}</p>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline">{country.visaFreeStays.tourist} days</Badge>
                            {country.taxResidencyDays && (
                              <Badge variant="secondary">{country.taxResidencyDays}d tax</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => setSelectedCountry(country)}
                      >
                        View Details
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </Tabs>

        {selectedCountry && (
          <Card className="mt-6 border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <span className="text-3xl">{selectedCountry.flag}</span>
                {selectedCountry.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Official Websites</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => window.open(selectedCountry.officialWebsites?.government, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Government Website
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => window.open(selectedCountry.officialWebsites?.visaApplication, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visa Applications
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => window.open(selectedCountry.officialWebsites?.passportApplication, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Passport Services
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => window.open(selectedCountry.officialWebsites?.tourism, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Tourism Information
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Add to Tracking</h4>
                <div className="grid gap-2">
                  {getTrackingReasons().map((item, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="justify-between"
                      onClick={() => handleAddCountryWithReason(selectedCountry, item.reason)}
                    >
                      <span>{item.reason}</span>
                      <Badge>{getRecommendedDayLimit(selectedCountry, item.reason)} days</Badge>
                    </Button>
                  ))}
                </div>
              </div>

              <Button 
                variant="ghost" 
                onClick={() => setSelectedCountry(null)}
                className="w-full"
              >
                Close Details
              </Button>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default TrackingRecommendations;
