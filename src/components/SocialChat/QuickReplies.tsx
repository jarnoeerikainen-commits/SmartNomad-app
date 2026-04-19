import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface QuickRepliesProps {
  suggestions: string[];
  onPick: (text: string) => void;
  isLoading?: boolean;
}

export const QuickReplies = ({ suggestions, onPick, isLoading }: QuickRepliesProps) => {
  if (!isLoading && suggestions.length === 0) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-2 border-t bg-accent/30 overflow-x-auto">
      <Sparkles className="h-3.5 w-3.5 text-primary flex-shrink-0" />
      {isLoading ? (
        <div className="flex gap-2">
          {[0, 1, 2].map(i => (
            <div key={i} className="h-7 w-24 rounded-full bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="flex gap-2 flex-nowrap">
          {suggestions.map((s, i) => (
            <Button
              key={i}
              variant="outline"
              size="sm"
              className="h-7 px-3 text-xs rounded-full whitespace-nowrap"
              onClick={() => onPick(s)}
            >
              {s}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};
