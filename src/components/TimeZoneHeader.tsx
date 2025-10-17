import React, { useState, useEffect } from 'react';
import { Clock, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TimeZone {
  id: string;
  name: string;
  city: string;
  offset: string;
}

const TIMEZONES = [
  { id: 'America/New_York', name: 'EST', city: 'New York', offset: '-05:00' },
  { id: 'America/Chicago', name: 'CST', city: 'Chicago', offset: '-06:00' },
  { id: 'America/Los_Angeles', name: 'PST', city: 'Los Angeles', offset: '-08:00' },
  { id: 'Europe/London', name: 'GMT', city: 'London', offset: '+00:00' },
  { id: 'Europe/Paris', name: 'CET', city: 'Paris', offset: '+01:00' },
  { id: 'Europe/Moscow', name: 'MSK', city: 'Moscow', offset: '+03:00' },
  { id: 'Asia/Dubai', name: 'GST', city: 'Dubai', offset: '+04:00' },
  { id: 'Asia/Kolkata', name: 'IST', city: 'Mumbai', offset: '+05:30' },
  { id: 'Asia/Singapore', name: 'SGT', city: 'Singapore', offset: '+08:00' },
  { id: 'Asia/Tokyo', name: 'JST', city: 'Tokyo', offset: '+09:00' },
  { id: 'Australia/Sydney', name: 'AEDT', city: 'Sydney', offset: '+11:00' },
  { id: 'Pacific/Auckland', name: 'NZDT', city: 'Auckland', offset: '+13:00' },
];

export const TimeZoneHeader: React.FC = () => {
  const getLocalTimezone = (): TimeZone => {
    const offsetMinutes = -new Date().getTimezoneOffset();
    const sign = offsetMinutes >= 0 ? '+' : '-';
    const hours = Math.floor(Math.abs(offsetMinutes) / 60);
    const minutes = Math.abs(offsetMinutes) % 60;
    const offset = `${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    
    return {
      id: 'local',
      name: 'Local',
      city: 'Your Location',
      offset
    };
  };

  const loadSavedHeaderTimezones = (): TimeZone[] => {
    const saved = localStorage.getItem('headerTimezones');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load saved header timezones', e);
      }
    }
    return [
      getLocalTimezone(),
      TIMEZONES[3], // London
      TIMEZONES[9], // Tokyo
    ];
  };

  const [selectedTimezones, setSelectedTimezones] = useState<TimeZone[]>(loadSavedHeaderTimezones());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('headerTimezones', JSON.stringify(selectedTimezones));
  }, [selectedTimezones]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getTimeForTimezone = (offset: string): Date => {
    const [sign, hours, minutes] = offset.match(/([+-])(\d{2}):(\d{2})/)?.slice(1) || ['+', '0', '0'];
    const offsetMs = (sign === '+' ? 1 : -1) * (parseInt(hours) * 60 + parseInt(minutes)) * 60 * 1000;
    const utc = currentTime.getTime() + currentTime.getTimezoneOffset() * 60 * 1000;
    return new Date(utc + offsetMs);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const updateTimezone = (index: number, timezoneId: string) => {
    let timezone: TimeZone | undefined;
    if (timezoneId === 'local') {
      timezone = getLocalTimezone();
    } else {
      timezone = TIMEZONES.find(tz => tz.id === timezoneId);
    }
    if (timezone) {
      const newTimezones = [...selectedTimezones];
      newTimezones[index] = timezone;
      setSelectedTimezones(newTimezones);
    }
  };

  return (
    <div className="hidden lg:flex items-center gap-3 px-4">
      {selectedTimezones.map((tz, index) => {
        const time = getTimeForTimezone(tz.offset);
        return (
          <div
            key={tz.id}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-border/50"
          >
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-xs font-medium leading-none">{tz.city}</span>
              <span className="text-sm font-mono font-bold leading-none mt-0.5">
                {formatTime(time)}
              </span>
            </div>
          </div>
        );
      })}
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
            <Settings className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Customize Time Zones</h4>
              <p className="text-xs text-muted-foreground">
                Select up to 3 time zones to display
              </p>
            </div>
            
            {[0, 1, 2].map((index) => (
              <div key={index} className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Time Zone {index + 1}
                </label>
                <Select
                  value={selectedTimezones[index]?.id}
                  onValueChange={(value) => updateTimezone(index, value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">
                      <div className="flex items-center justify-between w-full gap-4">
                        <span>Your Location (Local)</span>
                        <span className="text-xs text-muted-foreground">
                          Current
                        </span>
                      </div>
                    </SelectItem>
                    {TIMEZONES.map((tz) => (
                      <SelectItem key={tz.id} value={tz.id}>
                        <div className="flex items-center justify-between w-full gap-4">
                          <span>{tz.city}</span>
                          <span className="text-xs text-muted-foreground">
                            {tz.name} (UTC{tz.offset})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
