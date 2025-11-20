import React from 'react';
import { EliteClub } from '@/types/eliteClub';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  ExternalLink,
  MapPin,
  DollarSign,
  Clock,
  Star,
  Mail,
  Phone,
  Calendar,
  Sparkles,
  CheckCircle2,
  Users,
  Shirt,
} from 'lucide-react';

interface ClubDetailModalProps {
  club: EliteClub | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ClubDetailModal: React.FC<ClubDetailModalProps> = ({
  club,
  isOpen,
  onClose,
}) => {
  if (!club) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const totalFirstYear = club.membership.price.initiation + club.membership.price.annual;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <DialogTitle className="text-3xl">{club.name}</DialogTitle>
                {club.featured && <Sparkles className="h-6 w-6 text-yellow-500" />}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground mb-3">
                <MapPin className="h-4 w-4" />
                <span>{club.city}, {club.country}</span>
                <span className="mx-2">•</span>
                <Calendar className="h-4 w-4" />
                <span>Est. {club.established}</span>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(club.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-sm text-muted-foreground ml-2">
                  {club.rating} / 5.0
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Club Types */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Club Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              {club.type.map((type) => (
                <Badge key={type} variant="secondary" className="text-sm">
                  {type}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-3">About</h3>
            <p className="text-muted-foreground leading-relaxed">
              {club.description}
            </p>
          </div>

          <Separator />

          {/* Membership Details */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Membership Details
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-primary/5 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Membership Type</div>
                <Badge variant="destructive" className="text-base">
                  {club.membership.type}
                </Badge>
                {club.nominationRequired && (
                  <div className="text-xs text-muted-foreground mt-2">
                    ⚠️ Nomination Required
                  </div>
                )}
              </div>

              <div className="p-4 bg-primary/5 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Waitlist Period</div>
                <div className="text-2xl font-bold">{club.membership.waitlist} months</div>
              </div>

              <div className="p-4 bg-primary/5 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Initiation Fee</div>
                <div className="text-2xl font-bold">
                  {formatPrice(club.membership.price.initiation)}
                </div>
              </div>

              <div className="p-4 bg-primary/5 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Annual Dues</div>
                <div className="text-2xl font-bold">
                  {formatPrice(club.membership.price.annual)}
                </div>
              </div>
            </div>

            <div className="p-4 bg-accent rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Total First Year Cost:</span>
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(totalFirstYear)}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Membership Process */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Application Process</h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              {club.membershipProcess}
            </p>
          </div>

          <Separator />

          {/* Dress Code */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Shirt className="h-5 w-5" />
              Dress Code
            </h3>
            <Badge variant="outline" className="text-base">
              {club.dressCode}
            </Badge>
          </div>

          <Separator />

          {/* Amenities */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Amenities & Facilities</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
              {club.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span className="text-sm">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="font-medium">Address</div>
                  <div className="text-sm text-muted-foreground">
                    {club.contact.address}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Phone</div>
                  <a
                    href={`tel:${club.contact.phone}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {club.contact.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Email</div>
                  <a
                    href={`mailto:${club.contact.email}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {club.contact.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => window.open(club.website, '_blank')}
              className="flex-1"
              size="lg"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Visit Website
            </Button>
            <Button
              onClick={() => window.open(`mailto:${club.contact.email}`, '_blank')}
              variant="outline"
              size="lg"
            >
              <Mail className="h-4 w-4 mr-2" />
              Inquire
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
