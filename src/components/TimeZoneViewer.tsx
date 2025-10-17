import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Plus, X, Globe } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TimeZone {
  id: string;
  name: string;
  city: string;
  offset: string;
  time: Date;
}

const POPULAR_TIMEZONES = [
  { id: 'America/New_York', name: 'Eastern Time', city: 'New York', offset: '-05:00' },
  { id: 'America/Chicago', name: 'Central Time', city: 'Chicago', offset: '-06:00' },
  { id: 'America/Los_Angeles', name: 'Pacific Time', city: 'Los Angeles', offset: '-08:00' },
  { id: 'Europe/London', name: 'GMT', city: 'London', offset: '+00:00' },
  { id: 'Europe/Paris', name: 'CET', city: 'Paris', offset: '+01:00' },
  { id: 'Europe/Moscow', name: 'Moscow Time', city: 'Moscow', offset: '+03:00' },
  { id: 'Asia/Dubai', name: 'Gulf Time', city: 'Dubai', offset: '+04:00' },
  { id: 'Asia/Kolkata', name: 'India Time', city: 'Mumbai', offset: '+05:30' },
  { id: 'Asia/Singapore', name: 'Singapore Time', city: 'Singapore', offset: '+08:00' },
  { id: 'Asia/Tokyo', name: 'Japan Time', city: 'Tokyo', offset: '+09:00' },
  { id: 'Australia/Sydney', name: 'AEDT', city: 'Sydney', offset: '+11:00' },
  { id: 'Pacific/Auckland', name: 'NZDT', city: 'Auckland', offset: '+13:00' },
];

export const TimeZoneViewer: React.FC = () => {
  const getLocalTimezone = (): TimeZone => {
    const offsetMinutes = -new Date().getTimezoneOffset();
    const sign = offsetMinutes >= 0 ? '+' : '-';
    const hours = Math.floor(Math.abs(offsetMinutes) / 60);
    const minutes = Math.abs(offsetMinutes) % 60;
    const offset = `${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    
    return {
      id: 'local',
      name: 'Local Time',
      city: 'Your Location',
      offset,
      time: new Date()
    };
  };

  const loadSavedTimezones = (): TimeZone[] => {
    const saved = localStorage.getItem('worldClockTimezones');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((tz: any) => ({ ...tz, time: new Date() }));
      } catch (e) {
        console.error('Failed to load saved timezones', e);
      }
    }
    return [
      getLocalTimezone(),
      { ...POPULAR_TIMEZONES[3], time: new Date() },
      { ...POPULAR_TIMEZONES[9], time: new Date() },
    ];
  };

  const [selectedTimezones, setSelectedTimezones] = useState<TimeZone[]>(loadSavedTimezones());
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timezonesToSave = selectedTimezones.map(({ id, name, city, offset }) => ({ id, name, city, offset }));
    localStorage.setItem('worldClockTimezones', JSON.stringify(timezonesToSave));
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

  const addTimezone = (timezoneId: string) => {
    const timezone = POPULAR_TIMEZONES.find(tz => tz.id === timezoneId);
    if (timezone && !selectedTimezones.find(tz => tz.id === timezoneId)) {
      const newTimezones = [...selectedTimezones, { ...timezone, time: getTimeForTimezone(timezone.offset) }];
      setSelectedTimezones(newTimezones);
    }
  };

  const removeTimezone = (timezoneId: string) => {
    if (timezoneId === 'local') return; // Don't allow removing local time
    const newTimezones = selectedTimezones.filter(tz => tz.id !== timezoneId);
    setSelectedTimezones(newTimezones);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTimeOfDay = (date: Date) => {
    const hour = date.getHours();
    if (hour >= 5 && hour < 12) return { label: 'Morning', variant: 'default' as const };
    if (hour >= 12 && hour < 17) return { label: 'Afternoon', variant: 'secondary' as const };
    if (hour >= 17 && hour < 21) return { label: 'Evening', variant: 'outline' as const };
    return { label: 'Night', variant: 'destructive' as const };
  };

  const availableTimezones = POPULAR_TIMEZONES.filter(
    tz => !selectedTimezones.find(selected => selected.id === tz.id)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5" />
          World Time Zones
        </CardTitle>
        <CardDescription>
          Track multiple time zones for seamless global coordination
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Time Zone Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {selectedTimezones.map((timezone) => {
              const time = getTimeForTimezone(timezone.offset);
              const timeOfDay = getTimeOfDay(time);
              
              return (
                <Card key={timezone.id} className="relative overflow-hidden">
                  <CardContent className="p-4">
                    {timezone.id !== 'local' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 h-6 w-6 p-0"
                        onClick={() => removeTimezone(timezone.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="font-semibold text-lg">{timezone.city}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{timezone.name}</span>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-3xl font-bold font-mono">
                          {formatTime(time)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(time)}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant={timeOfDay.variant} className="text-xs">
                          {timeOfDay.label}
                        </Badge>
                        <span className="text-xs font-mono text-muted-foreground">
                          UTC{timezone.offset}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Add Time Zone */}
          {availableTimezones.length > 0 && (
            <div className="space-y-2">
              <Select onValueChange={addTimezone}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Add another time zone..." />
                </SelectTrigger>
                <SelectContent>
                  {availableTimezones.map((tz) => (
                    <SelectItem key={tz.id} value={tz.id}>
                      <div className="flex items-center justify-between gap-4">
                        <span>{tz.city} - {tz.name}</span>
                        <span className="text-xs text-muted-foreground">UTC{tz.offset}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Current Local Time */}
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm opacity-90">Your Local Time</div>
                  <div className="text-2xl font-bold font-mono">
                    {formatTime(currentTime)}
                  </div>
                </div>
                <Clock className="w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};