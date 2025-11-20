import { FamilyService } from '@/types/familyServices';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Shield,
  Heart,
  Globe2,
  Languages,
  Star,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface ServiceDetailModalProps {
  service: FamilyService | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ServiceDetailModal = ({ service, isOpen, onClose }: ServiceDetailModalProps) => {
  if (!service) return null;

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      default: return currency;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{service.name}</DialogTitle>
          <DialogDescription>
            <div className="flex items-center gap-2 mt-2">
              <Globe2 className="h-4 w-4" />
              <span>{service.cities.join(', ')}</span>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Rating Summary */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-6 w-6 fill-yellow-500 text-yellow-500" />
                  <span className="text-3xl font-bold">{service.rating.overall}</span>
                  <span className="text-muted-foreground">/ 5.0</span>
                </div>
                <p className="text-sm text-muted-foreground">{service.rating.reviewCount} verified reviews</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Reliability</p>
                  <p className="font-semibold">{service.rating.reliability}/5</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Communication</p>
                  <p className="font-semibold">{service.rating.communication}/5</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Safety</p>
                  <p className="font-semibold">{service.rating.safety}/5</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Expat Rating</p>
                  <p className="font-semibold">{service.rating.expatRating}/5</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">About</h3>
            <p className="text-muted-foreground">{service.description}</p>
            <p className="text-sm text-muted-foreground mt-2">
              <Calendar className="inline h-4 w-4 mr-1" />
              Established in {service.established}
            </p>
          </div>

          <Separator />

          {/* Service Types */}
          <div>
            <h3 className="font-semibold mb-3">Service Types</h3>
            <div className="flex flex-wrap gap-2">
              {service.type.map((type, index) => (
                <Badge key={index} variant="secondary">
                  {type}
                </Badge>
              ))}
            </div>
          </div>

          {/* Verification & Safety */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Safety & Verification
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {service.verification.backgroundChecks && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>Background Checks</span>
                </div>
              )}
              {service.verification.firstAidCertified && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>First Aid Certified</span>
                </div>
              )}
              {service.verification.referenceChecked && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>Reference Checked</span>
                </div>
              )}
              {service.verification.expatExperience && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>Expat Experience</span>
                </div>
              )}
              {service.verification.multilingual && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>Multilingual Staff</span>
                </div>
              )}
              {service.verification.drivingLicensed && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>Driving Licensed</span>
                </div>
              )}
              {service.verification.emergencyTrained && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>Emergency Trained</span>
                </div>
              )}
            </div>
          </div>

          {/* Languages */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Languages className="h-5 w-5 text-primary" />
              Languages Spoken
            </h3>
            <div className="flex flex-wrap gap-2">
              {service.languages.map((lang, index) => (
                <Badge key={index} variant="outline">
                  {lang}
                </Badge>
              ))}
            </div>
          </div>

          {/* Pricing Details */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Pricing
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="text-sm text-muted-foreground mb-1">Hourly</p>
                <p className="text-xl font-bold">
                  {getCurrencySymbol(service.pricing.currency)}{service.pricing.hourly}
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="text-sm text-muted-foreground mb-1">Daily</p>
                <p className="text-xl font-bold">
                  {getCurrencySymbol(service.pricing.currency)}{service.pricing.daily}
                </p>
              </div>
              <div className="bg-primary/10 rounded-lg p-3 text-center border-2 border-primary">
                <p className="text-sm text-muted-foreground mb-1">Monthly</p>
                <p className="text-xl font-bold text-primary">
                  {getCurrencySymbol(service.pricing.currency)}{service.pricing.monthly.toLocaleString()}
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              <AlertCircle className="inline h-4 w-4 mr-1" />
              Minimum commitment: {service.minimumCommitment}
            </p>
          </div>

          {/* Special Features */}
          {service.specialFeatures.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Special Features</h3>
              <div className="grid grid-cols-2 gap-2">
                {service.specialFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Booking Process */}
          <div>
            <h3 className="font-semibold mb-2">Booking Process</h3>
            <p className="text-sm text-muted-foreground">{service.bookingProcess}</p>
          </div>

          <Separator />

          {/* Contact Information */}
          <div>
            <h3 className="font-semibold mb-3">Contact Information</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{service.contact.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${service.contact.email}`} className="text-primary hover:underline">
                  {service.contact.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href={`tel:${service.contact.phone}`} className="text-primary hover:underline">
                  {service.contact.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => window.open(service.website, '_blank')}
              className="flex-1"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Visit Website
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open(`mailto:${service.contact.email}`, '_blank')}
              className="flex-1"
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
