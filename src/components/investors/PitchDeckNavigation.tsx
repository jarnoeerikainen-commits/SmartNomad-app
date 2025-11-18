import { ChevronLeft, ChevronRight, Maximize2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PitchDeckNavigationProps {
  currentSlide: number;
  totalSlides: number;
  onPrevious: () => void;
  onNext: () => void;
  onSlideSelect: (index: number) => void;
  onPresentationMode: () => void;
  onReset: () => void;
}

export const PitchDeckNavigation = ({
  currentSlide,
  totalSlides,
  onPrevious,
  onNext,
  onSlideSelect,
  onPresentationMode,
  onReset,
}: PitchDeckNavigationProps) => {
  const slideNames = [
    'Cover',
    'Problem',
    'Solution',
    'Market',
    'Product',
    'Business Model',
    'Traction',
    'Competition',
    'Go-to-Market',
    'Financials',
    'Team',
    'The Ask',
  ];

  return (
    <div className="flex items-center justify-between gap-4 py-4">
      {/* Left: Previous */}
      <Button
        onClick={onPrevious}
        disabled={currentSlide === 0}
        variant="outline"
        size="sm"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Previous
      </Button>

      {/* Center: Slide indicator + thumbnails */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground font-medium">
          {currentSlide + 1} / {totalSlides}
        </span>
        <div className="flex gap-1">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              onClick={() => onSlideSelect(i)}
              className={`h-2 rounded-full transition-all ${
                i === currentSlide
                  ? 'w-8 bg-primary'
                  : 'w-2 bg-muted hover:bg-muted-foreground'
              }`}
              title={slideNames[i]}
            />
          ))}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex gap-2">
        <Button onClick={onReset} variant="ghost" size="sm" title="Reset to defaults">
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button onClick={onPresentationMode} variant="outline" size="sm">
          <Maximize2 className="h-4 w-4 mr-1" />
          Present
        </Button>
        <Button onClick={onNext} disabled={currentSlide === totalSlides - 1} size="sm">
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};
