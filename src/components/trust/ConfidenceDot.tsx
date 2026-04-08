import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ConfidenceLevel, useTrust } from '@/contexts/TrustContext';

interface ConfidenceDotProps {
  level: ConfidenceLevel;
  size?: 'sm' | 'md';
}

const ConfidenceDot: React.FC<ConfidenceDotProps> = ({ level, size = 'sm' }) => {
  const { getConfidenceColor, getConfidenceLabel } = useTrust();
  const px = size === 'sm' ? 'w-2 h-2' : 'w-3 h-3';

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={`${px} rounded-full inline-block flex-shrink-0 cursor-help`}
            style={{ backgroundColor: getConfidenceColor(level) }}
          />
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          <div className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: getConfidenceColor(level) }}
            />
            {getConfidenceLabel(level)}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ConfidenceDot;
