import { Badge } from '@/components/ui/badge';
import { ServiceType } from '@/types/businessCenter';
import { SERVICE_LABELS } from '@/data/businessCentersData';
import { Printer, Send, Monitor, ScanLine, Package } from 'lucide-react';

interface ServiceFilterChipsProps {
  selectedServices: ServiceType[];
  onToggle: (service: ServiceType) => void;
}

const SERVICE_ICONS: Record<ServiceType, React.ComponentType<{ className?: string }>> = {
  printing: Printer,
  fax: Send,
  computer: Monitor,
  scanning: ScanLine,
  shipping: Package,
};

export const ServiceFilterChips = ({ selectedServices, onToggle }: ServiceFilterChipsProps) => {
  const services: ServiceType[] = ['printing', 'fax', 'computer', 'scanning', 'shipping'];

  return (
    <div className="flex flex-wrap gap-2">
      {services.map(service => {
        const Icon = SERVICE_ICONS[service];
        const isSelected = selectedServices.includes(service);
        
        return (
          <Badge
            key={service}
            variant={isSelected ? 'default' : 'outline'}
            className={`cursor-pointer transition-all duration-200 hover:shadow-soft ${
              isSelected ? 'shadow-soft' : ''
            }`}
            onClick={() => onToggle(service)}
          >
            <Icon className="w-3 h-3 mr-1" />
            {SERVICE_LABELS[service]}
          </Badge>
        );
      })}
    </div>
  );
};
