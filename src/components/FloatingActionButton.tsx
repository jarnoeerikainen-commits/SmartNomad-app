import React, { useState } from 'react';
import { Plus, Plane, MapPin, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface FloatingActionButtonProps {
  onAction: (action: string) => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onAction }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const actions = [
    { id: 'add-country', label: 'Add Country Visit', icon: MapPin, color: 'gradient-primary' },
    { id: 'add-visa', label: 'Track Visa', icon: Plane, color: 'gradient-trust' },
    { id: 'add-document', label: 'Upload Document', icon: FileText, color: 'gradient-sunset' },
  ];

  return (
    <div className="fixed bottom-20 right-4 md:bottom-6 md:right-24 z-30">
      <TooltipProvider>
        <div className="flex flex-col-reverse items-end gap-3">
          {/* Action buttons */}
          {isExpanded && (
            <div className="flex flex-col-reverse gap-2 animate-fade-in">
              {actions.map((action) => (
                <Tooltip key={action.id}>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => {
                        onAction(action.id);
                        setIsExpanded(false);
                      }}
                      className={`h-12 w-12 rounded-full ${action.color} shadow-large hover:shadow-glow transition-all duration-300`}
                      size="lg"
                    >
                      <action.icon className="h-5 w-5 text-white" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>{action.label}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          )}

          {/* Main FAB button */}
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`h-16 w-16 rounded-full transition-all duration-300 ${
              isExpanded 
                ? 'bg-destructive hover:bg-destructive/90 rotate-45' 
                : 'gradient-hero shadow-large hover:shadow-glow'
            }`}
            size="lg"
          >
            {isExpanded ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Plus className="h-6 w-6 text-white" />
            )}
          </Button>
        </div>
      </TooltipProvider>
    </div>
  );
};

export default FloatingActionButton;
