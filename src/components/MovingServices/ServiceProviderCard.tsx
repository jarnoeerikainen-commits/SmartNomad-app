import { MovingServiceProvider } from '@/types/movingServices';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, CheckCircle, ExternalLink, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface ServiceProviderCardProps {
  provider: MovingServiceProvider;
}

export function ServiceProviderCard({ provider }: ServiceProviderCardProps) {
  const handleGetQuote = () => {
    toast.success(`Quote request sent to ${provider.name}!`, {
      description: 'They will contact you within 24-48 hours.'
    });
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {provider.featured && (
        <div className="bg-gradient-primary px-4 py-1.5 text-center">
          <div className="flex items-center justify-center gap-1 text-white text-sm font-medium">
            <Sparkles className="h-3 w-3" />
            Featured Partner
          </div>
        </div>
      )}
      
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-1">{provider.name}</CardTitle>
            <CardDescription className="text-sm">
              {provider.type === 'international' ? 'International Moving' : 
               provider.type === 'local' ? 'Local Moving' : 
               'International & Local'}
            </CardDescription>
          </div>
          {provider.featured && (
            <Badge variant="secondary" className="ml-2">
              Top Rated
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{provider.rating}</span>
            <span className="text-sm text-muted-foreground">
              ({provider.reviews.toLocaleString()})
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {provider.description}
        </p>

        {/* Coverage */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <MapPin className="h-4 w-4 text-primary" />
            Coverage
          </div>
          <div className="flex flex-wrap gap-1">
            {provider.coverage.slice(0, 3).map((location, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {location}
              </Badge>
            ))}
            {provider.coverage.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{provider.coverage.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Specialties */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <CheckCircle className="h-4 w-4 text-primary" />
            Specialties
          </div>
          <div className="flex flex-wrap gap-1">
            {provider.specialties.slice(0, 2).map((specialty, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {specialty}
              </Badge>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="pt-3 border-t">
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-2xl font-bold">
              {provider.priceRange.currency} {provider.priceRange.min.toLocaleString()}
            </span>
            <span className="text-muted-foreground">- {provider.priceRange.max.toLocaleString()}</span>
          </div>
          <p className="text-xs text-muted-foreground capitalize">
            {provider.priceRange.unit.replace('-', ' ')}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button onClick={handleGetQuote} className="flex-1 gap-2">
            {provider.autoQuote ? (
              <>
                <Sparkles className="h-4 w-4" />
                Get Instant Quote
              </>
            ) : (
              'Request Quote'
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => window.open(provider.website, '_blank')}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>

        {/* Certifications */}
        {provider.certifications.length > 0 && (
          <div className="pt-2 border-t">
            <div className="flex flex-wrap gap-1">
              {provider.certifications.map((cert, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {cert}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
