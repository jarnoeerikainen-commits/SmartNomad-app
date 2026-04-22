import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar as CalendarIcon,
  Plane,
  Hotel,
  Utensils,
  Dumbbell,
  Sparkles,
  Users,
  Briefcase,
  Heart,
  Cake,
  Scale,
  Bell,
  CheckCircle2,
  X,
  MapPin,
  Clock,
} from 'lucide-react';
import { CalendarEventCategory, CalendarEventProposal } from '@/types/calendarEvent';
import { useCalendar } from '@/hooks/useCalendar';
import { useToast } from '@/hooks/use-toast';

const CATEGORY_ICON: Record<CalendarEventCategory, React.ComponentType<{ className?: string }>> = {
  travel: Plane,
  accommodation: Hotel,
  meal: Utensils,
  sport: Dumbbell,
  wellness: Sparkles,
  meeting: Briefcase,
  family: Users,
  social: Heart,
  birthday: Cake,
  legal: Scale,
  personal: CalendarIcon,
  reservation: CalendarIcon,
  reminder: Bell,
};

const CATEGORY_LABEL: Record<CalendarEventCategory, string> = {
  travel: 'Travel',
  accommodation: 'Stay',
  meal: 'Dining',
  sport: 'Sport',
  wellness: 'Wellness',
  meeting: 'Meeting',
  family: 'Family',
  social: 'Social',
  birthday: 'Birthday',
  legal: 'Legal',
  personal: 'Personal',
  reservation: 'Booking',
  reminder: 'Reminder',
};

interface Props {
  items: CalendarEventProposal[];
}

const CalendarProposalCards: React.FC<Props> = ({ items }) => {
  const { confirmProposal } = useCalendar();
  const { toast } = useToast();
  const [statuses, setStatuses] = useState<Record<number, 'pending' | 'added' | 'declined'>>({});

  const handleAdd = (proposal: CalendarEventProposal, idx: number) => {
    confirmProposal(proposal);
    setStatuses((prev) => ({ ...prev, [idx]: 'added' }));
    toast({
      title: 'Added to your calendar',
      description: `${proposal.title} — reminders set automatically.`,
    });
  };

  const handleDecline = (idx: number) => {
    setStatuses((prev) => ({ ...prev, [idx]: 'declined' }));
  };

  return (
    <div className="space-y-2 my-2">
      {items.map((proposal, idx) => {
        const Icon = CATEGORY_ICON[proposal.category] ?? CalendarIcon;
        const status = statuses[idx] ?? 'pending';
        const start = new Date(proposal.start);
        const dateLabel = start.toLocaleDateString(undefined, {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        });
        const timeLabel = start.toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
        });

        return (
          <Card
            key={idx}
            className="p-3 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent"
          >
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2 shrink-0">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <Badge variant="secondary" className="text-[10px] uppercase tracking-wide">
                    {CATEGORY_LABEL[proposal.category]}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <CalendarIcon className="h-3 w-3" />
                    {dateLabel}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {timeLabel}
                  </span>
                </div>
                <div className="font-medium text-sm leading-snug">{proposal.title}</div>
                {proposal.location && (
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {proposal.location}
                  </div>
                )}
                {proposal.notes && (
                  <div className="text-xs text-muted-foreground mt-1">{proposal.notes}</div>
                )}

                {status === 'pending' && (
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      onClick={() => handleAdd(proposal, idx)}
                      className="h-8 px-3 text-xs"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                      Add to calendar
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDecline(idx)}
                      className="h-8 px-3 text-xs"
                    >
                      <X className="h-3.5 w-3.5 mr-1" />
                      Not now
                    </Button>
                  </div>
                )}
                {status === 'added' && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-primary font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Added — I'll remind you.
                  </div>
                )}
                {status === 'declined' && (
                  <div className="text-xs text-muted-foreground mt-2 italic">Skipped.</div>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default CalendarProposalCards;
