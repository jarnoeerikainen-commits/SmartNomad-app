
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, MapPin, Wifi, Clock } from 'lucide-react';
import { LocationData } from '@/types/country';

interface VPNDetectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  detectedLocation: LocationData | null;
  vpnDuration: number;
  onConfirmLocation: (isCorrect: boolean) => void;
  onDisableVPN: () => void;
}

const VPNDetectionModal: React.FC<VPNDetectionModalProps> = ({
  isOpen,
  onClose,
  detectedLocation,
  vpnDuration,
  onConfirmLocation,
  onDisableVPN
}) => {
  const formatDuration = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            VPN Detected
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <Wifi className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-800">VPN Activity Detected</span>
            </div>
            <p className="text-sm text-orange-700">
              Your VPN has been active for {formatDuration(vpnDuration)}. This may affect location accuracy for travel day tracking.
            </p>
          </div>

          {detectedLocation && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Detected Location</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-blue-700">
                  <strong>{detectedLocation.city}, {detectedLocation.country}</strong>
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {detectedLocation.country_code}
                  </Badge>
                  <span className="text-xs text-blue-600">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {new Date(detectedLocation.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="text-center text-sm text-gray-600">
            <p>Is this your correct location for travel day tracking?</p>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <div className="flex gap-2 w-full">
            <Button 
              onClick={() => onConfirmLocation(true)}
              variant="default"
              size="sm"
              className="flex-1"
            >
              Yes, Correct
            </Button>
            <Button 
              onClick={() => onConfirmLocation(false)}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              No, Wrong
            </Button>
          </div>
          
          <Button 
            onClick={onDisableVPN}
            variant="outline"
            size="sm"
            className="w-full text-orange-600 border-orange-300 hover:bg-orange-50"
          >
            Disable VPN Temporarily
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VPNDetectionModal;
