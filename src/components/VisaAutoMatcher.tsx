import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Plane, ExternalLink, ChevronDown, ChevronUp, DollarSign, Clock, Star, Globe } from 'lucide-react';
import { Country } from '@/types/country';
import { VisaAutoMatcherService, VisaMatch } from '@/services/VisaAutoMatcherService';
import { useDemoPersona } from '@/contexts/DemoPersonaContext';

interface VisaAutoMatcherProps {
  countries: Country[];
}

const VisaCard: React.FC<{ visa: VisaMatch; rank: number }> = ({ visa, rank }) => {
  const [expanded, setExpanded] = useState(false);

  const scoreColor = visa.eligibilityScore >= 80 
    ? 'text-emerald-600' 
    : visa.eligibilityScore >= 60 
      ? 'text-amber-600' 
      : 'text-muted-foreground';

  const progressColor = visa.eligibilityScore >= 80 
    ? '[&>div]:bg-emerald-500' 
    : visa.eligibilityScore >= 60 
      ? '[&>div]:bg-amber-500' 
      : '[&>div]:bg-blue-500';

  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="text-center shrink-0">
            <span className="text-2xl">{visa.flag}</span>
            <div className={`text-xs font-bold mt-1 ${scoreColor}`}>
              {visa.eligibilityScore}%
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-sm text-foreground">{visa.visaName}</h4>
              {rank <= 3 && (
                <Badge variant="secondary" className="text-[10px]">
                  <Star className="w-2.5 h-2.5 mr-0.5" />
                  Top Match
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{visa.country}</p>
            
            <Progress value={visa.eligibilityScore} className={`h-1.5 mt-2 ${progressColor}`} />
            
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {visa.duration}
              </span>
              {visa.incomeRequirement && (
                <span className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" /> {visa.incomeRequirement}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3" /> {visa.processingTime}
              </span>
            </div>

            <div className="mt-2">
              <p className="text-xs font-medium text-primary">{visa.taxBenefit}</p>
            </div>

            {/* Match reasons */}
            <div className="flex flex-wrap gap-1 mt-2">
              {visa.matchReasons.map((reason, i) => (
                <Badge key={i} variant="outline" className="text-[10px] font-normal">
                  {reason}
                </Badge>
              ))}
            </div>

            {expanded && (
              <div className="mt-3 space-y-2 animate-fade-in">
                <div className="flex flex-wrap gap-1.5">
                  {visa.highlights.map((h, i) => (
                    <Badge key={i} variant="secondary" className="text-[10px]">
                      {h}
                    </Badge>
                  ))}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-7 gap-1"
                  onClick={() => window.open(visa.applyUrl, '_blank')}
                >
                  <ExternalLink className="w-3 h-3" /> Official Website
                </Button>
              </div>
            )}
          </div>

          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 shrink-0"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const VisaAutoMatcher: React.FC<VisaAutoMatcherProps> = ({ countries }) => {
  const { activePersona } = useDemoPersona();
  const [showAll, setShowAll] = useState(false);
  
  const nationality = activePersona?.profile?.nationality || '';

  const visas = useMemo(() => 
    VisaAutoMatcherService.matchVisas(nationality, countries),
    [nationality, countries]
  );

  const displayVisas = showAll ? visas : visas.slice(0, 5);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Plane className="w-5 h-5 text-primary" />
            Visa Auto-Matcher
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {visas.length} visas matched
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Digital nomad visas ranked by your travel patterns
          {nationality && ` & ${nationality} nationality`}
        </p>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {displayVisas.map((visa, i) => (
          <VisaCard key={visa.id} visa={visa} rank={i + 1} />
        ))}
        
        {visas.length > 5 && (
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Top 5' : `Show All ${visas.length} Visas`}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default VisaAutoMatcher;
