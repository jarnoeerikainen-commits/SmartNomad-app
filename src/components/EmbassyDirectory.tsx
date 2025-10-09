import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Phone, Globe, MapPin } from 'lucide-react';
import EmbassyService from '@/services/EmbassyService';
import { useLanguage } from '@/contexts/LanguageContext';

const EmbassyDirectory: React.FC = () => {
  const { t } = useLanguage();
  const embassyService = EmbassyService.getInstance();
  const embassies = embassyService.getAvailableEmbassies();

  const getCountryFlag = (countryCode: string) => {
    return String.fromCodePoint(
      ...countryCode
        .toUpperCase()
        .split('')
        .map((char) => 127397 + char.charCodeAt(0))
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">{t('embassy.title')}</h2>
        <p className="text-muted-foreground">
          {t('embassy.description')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {embassies.map((embassy) => (
          <Card key={embassy.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{getCountryFlag(embassy.countryCode)}</span>
                  <div>
                    <CardTitle className="text-lg">{embassy.country}</CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {embassy.name}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Button
                  variant="default"
                  className="w-full justify-start"
                  onClick={() => window.open(embassy.website, '_blank')}
                >
                  <Globe className="h-4 w-4 mr-2" />
                  {t('embassy.visit_website')}
                  <ExternalLink className="h-3 w-3 ml-auto" />
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => window.open(embassy.travelAdvisoryUrl, '_blank')}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  {t('embassy.travel_advice')}
                  <ExternalLink className="h-3 w-3 ml-auto" />
                </Button>

                {embassy.registrationUrl && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => window.open(embassy.registrationUrl, '_blank')}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    {t('embassy.register')}
                    <ExternalLink className="h-3 w-3 ml-auto" />
                  </Button>
                )}
              </div>

              <div className="pt-3 border-t space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono text-xs">{embassy.emergencyContact}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {embassy.languages.map((lang) => (
                    <Badge key={lang} variant="secondary" className="text-xs">
                      {lang.toUpperCase()}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-muted/50 border-2 border-dashed">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground text-center">
            {t('embassy.tip')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmbassyDirectory;
