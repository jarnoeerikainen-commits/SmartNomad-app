import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SecurityService } from '@/types/securityServices';
import {
  Shield, Star, Globe, Clock, DollarSign, Phone, Mail,
  ExternalLink, Users, Award, CheckCircle, MapPin
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { VERIFICATION_BADGES } from '@/data/securityServicesData';

interface SecurityServiceDetailModalProps {
  service: SecurityService | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SecurityServiceDetailModal: React.FC<SecurityServiceDetailModalProps> = ({
  service,
  open,
  onOpenChange,
}) => {
  if (!service) return null;

  const getServiceTypeLabel = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="h-6 w-6 text-primary" />
                <DialogTitle className="text-2xl">{service.name}</DialogTitle>
              </div>
              
              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(service.rating.overall)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-muted-foreground/30'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold">{service.rating.overall}/5</span>
              </div>
            </div>

            <Badge className="bg-primary/10 text-primary">
              <Globe className="h-4 w-4 mr-1" />
              {service.coverage.charAt(0).toUpperCase() + service.coverage.slice(1)}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Description */}
          <div>
            <p className="text-muted-foreground">{service.description}</p>
          </div>

          <Separator />

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Established</p>
              <p className="text-lg font-semibold">{service.established}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Team Size</p>
              <p className="text-lg font-semibold">{service.team.size}+</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Response Time</p>
              <p className="text-sm font-semibold">{service.responseTime}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Coverage</p>
              <p className="text-sm font-semibold capitalize">{service.coverage}</p>
            </div>
          </div>

          <Separator />

          {/* Pricing */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Pricing
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border border-border/50 bg-card">
                <p className="text-xs text-muted-foreground mb-1">Hourly Rate</p>
                <p className="text-xl font-bold text-foreground">
                  {service.pricing.currency} {service.pricing.hourly.toLocaleString()}
                </p>
              </div>
              <div className="p-4 rounded-lg border border-border/50 bg-card">
                <p className="text-xs text-muted-foreground mb-1">Daily Rate</p>
                <p className="text-xl font-bold text-foreground">
                  {service.pricing.currency} {service.pricing.daily.toLocaleString()}
                </p>
              </div>
              <div className="p-4 rounded-lg border border-border/50 bg-card">
                <p className="text-xs text-muted-foreground mb-1">Monthly Rate</p>
                <p className="text-xl font-bold text-foreground">
                  {service.pricing.currency} {service.pricing.monthly.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Service Types */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Service Types</h3>
            <div className="flex flex-wrap gap-2">
              {service.type.map((type) => (
                <Badge key={type} variant="outline">
                  {getServiceTypeLabel(type)}
                </Badge>
              ))}
            </div>
          </div>

          {/* Services Offered */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Services Offered</h3>
            <div className="grid grid-cols-2 gap-2">
              {service.services.map((s, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">{s}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Capabilities */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Capabilities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(service.capabilities).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  {value ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
                  )}
                  <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Team Background */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Background
            </h3>
            <div className="flex flex-wrap gap-2">
              {service.team.background.map((bg, index) => (
                <Badge key={index} variant="secondary">
                  {bg}
                </Badge>
              ))}
            </div>
            <div className="mt-3">
              <p className="text-sm text-muted-foreground mb-2">Languages:</p>
              <div className="flex flex-wrap gap-2">
                {service.team.languages.map((lang, index) => (
                  <Badge key={index} variant="outline">
                    {lang}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Certifications */}
          {service.certifications.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Award className="h-5 w-5" />
                Certifications
              </h3>
              <div className="flex flex-wrap gap-2">
                {service.certifications.map((cert, index) => (
                  <Badge key={index} variant="secondary" className="bg-primary/10 text-primary">
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Verification */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Verification & Credentials</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(service.verification).map(([key, value]) => {
                if (!value) return null;
                const badge = VERIFICATION_BADGES[key as keyof typeof VERIFICATION_BADGES];
                if (!badge) return null;
                return (
                  <Badge key={key} variant="secondary">
                    {badge.icon} {badge.label}
                  </Badge>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Locations */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Locations
            </h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Cities:</p>
                <p className="text-sm">{service.cities.join(', ')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Countries:</p>
                <p className="text-sm">{service.countries.join(', ')}</p>
              </div>
            </div>
          </div>

          {/* Client Types */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Typical Clients</h3>
            <div className="flex flex-wrap gap-2">
              {service.clients.map((client, index) => (
                <Badge key={index} variant="outline">
                  {client}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <Phone className="h-5 w-5 text-destructive" />
                <div>
                  <p className="text-sm font-medium text-destructive">Emergency: {service.contact.emergency}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border/50">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm">Business: {service.contact.business}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border/50">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm">{service.contact.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              className="flex-1"
              onClick={() => window.open(service.website, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Visit Website
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open(`tel:${service.contact.emergency}`, '_blank')}
            >
              <Phone className="h-4 w-4 mr-2" />
              Call Emergency
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SecurityServiceDetailModal;
