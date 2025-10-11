import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, MapPin } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth } from 'date-fns';
import { cn } from '@/lib/utils';
import { Country } from '@/types/country';

interface TimelineEntry {
  date: Date;
  country: string;
  countryCode: string;
  flag: string;
  type: 'entry' | 'exit' | 'stay';
}

interface TravelTimelineProps {
  countries: Country[];
  entries?: TimelineEntry[];
}

export const TravelTimeline: React.FC<TravelTimelineProps> = ({ countries, entries = [] }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEntriesForDay = (day: Date) => {
    return entries.filter(entry => isSameDay(entry.date, day));
  };

  const getCountryColor = (countryCode: string) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500',
      'bg-pink-500', 'bg-teal-500', 'bg-indigo-500', 'bg-red-500'
    ];
    const index = countries.findIndex(c => c.code === countryCode);
    return colors[index % colors.length];
  };

  const getMonthStats = () => {
    const monthEntries = entries.filter(entry => isSameMonth(entry.date, selectedMonth));
    const uniqueCountries = new Set(monthEntries.map(e => e.countryCode));
    const travelDays = monthEntries.filter(e => e.type === 'stay').length;
    
    return {
      countries: uniqueCountries.size,
      travelDays,
      entries: monthEntries.filter(e => e.type === 'entry').length
    };
  };

  const stats = getMonthStats();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Travel Timeline
        </CardTitle>
        <CardDescription>
          Visual calendar view of your travel history
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1))}
            className="px-4 py-2 rounded-md hover:bg-muted transition-colors"
          >
            ← Previous
          </button>
          <h3 className="text-xl font-semibold">
            {format(selectedMonth, 'MMMM yyyy')}
          </h3>
          <button
            onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1))}
            className="px-4 py-2 rounded-md hover:bg-muted transition-colors"
          >
            Next →
          </button>
        </div>

        {/* Month Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold text-primary">{stats.countries}</div>
            <div className="text-sm text-muted-foreground">Countries</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold text-primary">{stats.travelDays}</div>
            <div className="text-sm text-muted-foreground">Travel Days</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold text-primary">{stats.entries}</div>
            <div className="text-sm text-muted-foreground">Entries</div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="space-y-2">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-semibold text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: monthStart.getDay() }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {/* Actual days */}
            {daysInMonth.map(day => {
              const dayEntries = getEntriesForDay(day);
              const isToday = isSameDay(day, new Date());
              
              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    "aspect-square p-2 rounded-lg border relative group cursor-pointer transition-all hover:shadow-md",
                    isToday && "border-primary border-2",
                    dayEntries.length > 0 ? "bg-muted/50" : "bg-background"
                  )}
                >
                  <div className="text-sm font-medium">{format(day, 'd')}</div>
                  
                  {/* Country indicators */}
                  {dayEntries.length > 0 && (
                    <div className="mt-1 space-y-1">
                      {dayEntries.slice(0, 2).map((entry, i) => (
                        <div
                          key={i}
                          className={cn(
                            "text-xs px-1 py-0.5 rounded text-white truncate",
                            getCountryColor(entry.countryCode)
                          )}
                        >
                          {entry.flag}
                        </div>
                      ))}
                      {dayEntries.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{dayEntries.length - 2}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Hover tooltip */}
                  {dayEntries.length > 0 && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 w-48">
                      <div className="bg-popover text-popover-foreground p-2 rounded-md shadow-lg border text-xs space-y-1">
                        {dayEntries.map((entry, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span>{entry.flag}</span>
                            <span className="font-medium">{entry.country}</span>
                            <Badge variant="outline" className="text-xs">
                              {entry.type}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold mb-2">Countries in this period:</h4>
          <div className="flex flex-wrap gap-2">
            {countries.map(country => (
              <Badge
                key={country.code}
                variant="outline"
                className="flex items-center gap-1"
              >
                <div className={cn("w-2 h-2 rounded-full", getCountryColor(country.code))} />
                {country.flag} {country.name}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
