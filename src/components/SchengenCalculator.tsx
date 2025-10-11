import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { CalendarIcon, Plus, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { format, differenceInDays, subDays, addDays } from 'date-fns';
import { cn } from '@/lib/utils';

interface SchengenEntry {
  id: string;
  entryDate: Date;
  exitDate: Date | null;
  country: string;
}

const SCHENGEN_COUNTRIES = [
  'Austria', 'Belgium', 'Czech Republic', 'Croatia', 'Denmark', 'Estonia', 'Finland',
  'France', 'Germany', 'Greece', 'Hungary', 'Iceland', 'Italy', 'Latvia', 'Liechtenstein',
  'Lithuania', 'Luxembourg', 'Malta', 'Netherlands', 'Norway', 'Poland', 'Portugal',
  'Slovakia', 'Slovenia', 'Spain', 'Sweden', 'Switzerland'
];

export const SchengenCalculator: React.FC = () => {
  const [entries, setEntries] = useState<SchengenEntry[]>([]);
  const [newEntry, setNewEntry] = useState<{
    entryDate: Date | undefined;
    exitDate: Date | undefined;
    country: string;
  }>({
    entryDate: undefined,
    exitDate: undefined,
    country: SCHENGEN_COUNTRIES[0]
  });

  const calculateSchengenDays = () => {
    const today = new Date();
    const lookbackDate = subDays(today, 180);
    
    let totalDays = 0;
    entries.forEach(entry => {
      const entryStart = entry.entryDate > lookbackDate ? entry.entryDate : lookbackDate;
      const entryEnd = entry.exitDate || today;
      
      if (entryEnd >= lookbackDate) {
        const days = differenceInDays(entryEnd, entryStart) + 1;
        totalDays += Math.max(0, days);
      }
    });
    
    return totalDays;
  };

  const getDaysRemaining = () => {
    return Math.max(0, 90 - calculateSchengenDays());
  };

  const getEarliestExitDate = () => {
    const daysUsed = calculateSchengenDays();
    if (daysUsed < 90) return null;
    
    // Find when the earliest day will fall outside the 180-day window
    const sortedEntries = [...entries].sort((a, b) => a.entryDate.getTime() - b.entryDate.getTime());
    if (sortedEntries.length === 0) return null;
    
    return addDays(sortedEntries[0].entryDate, 180);
  };

  const addEntry = () => {
    if (!newEntry.entryDate) return;
    
    const entry: SchengenEntry = {
      id: Date.now().toString(),
      entryDate: newEntry.entryDate,
      exitDate: newEntry.exitDate || null,
      country: newEntry.country
    };
    
    setEntries([...entries, entry]);
    setNewEntry({
      entryDate: undefined,
      exitDate: undefined,
      country: SCHENGEN_COUNTRIES[0]
    });
  };

  const removeEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const daysUsed = calculateSchengenDays();
  const daysRemaining = getDaysRemaining();
  const percentage = (daysUsed / 90) * 100;
  const earliestExit = getEarliestExitDate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>🇪🇺</span>
          Schengen 90/180 Calculator
        </CardTitle>
        <CardDescription>
          Track your time in the Schengen Area. You can stay up to 90 days within any 180-day period.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Overview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{daysUsed} / 90 days</p>
              <p className="text-sm text-muted-foreground">Used in last 180 days</p>
            </div>
            <Badge variant={percentage > 80 ? 'destructive' : percentage > 60 ? 'default' : 'secondary'}>
              {daysRemaining} days remaining
            </Badge>
          </div>
          
          <Progress value={percentage} className="h-2" />

          {percentage > 80 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                You're approaching the 90-day limit! 
                {earliestExit && ` You must leave by ${format(earliestExit, 'PPP')}`}
              </AlertDescription>
            </Alert>
          )}

          {percentage <= 80 && percentage > 0 && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                You're within safe limits. You can stay {daysRemaining} more days.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Add New Entry */}
        <div className="space-y-4 border-t pt-4">
          <h3 className="font-semibold">Add Trip</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Country</Label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={newEntry.country}
                onChange={(e) => setNewEntry({ ...newEntry, country: e.target.value })}
              >
                {SCHENGEN_COUNTRIES.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Entry Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newEntry.entryDate ? format(newEntry.entryDate, 'PPP') : 'Pick date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={newEntry.entryDate}
                    onSelect={(date) => setNewEntry({ ...newEntry, entryDate: date })}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Exit Date (optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newEntry.exitDate ? format(newEntry.exitDate, 'PPP') : 'Still there'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={newEntry.exitDate}
                    onSelect={(date) => setNewEntry({ ...newEntry, exitDate: date })}
                    disabled={(date) => newEntry.entryDate ? date < newEntry.entryDate : false}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Button onClick={addEntry} disabled={!newEntry.entryDate} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Trip
          </Button>
        </div>

        {/* Entry List */}
        {entries.length > 0 && (
          <div className="space-y-2 border-t pt-4">
            <h3 className="font-semibold">Your Trips</h3>
            {entries.sort((a, b) => b.entryDate.getTime() - a.entryDate.getTime()).map(entry => {
              const days = entry.exitDate 
                ? differenceInDays(entry.exitDate, entry.entryDate) + 1
                : differenceInDays(new Date(), entry.entryDate) + 1;
              
              return (
                <div key={entry.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex-1">
                    <p className="font-medium">{entry.country}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(entry.entryDate, 'MMM dd, yyyy')} 
                      {' → '}
                      {entry.exitDate ? format(entry.exitDate, 'MMM dd, yyyy') : 'Present'}
                      <Badge variant="outline" className="ml-2">{days} days</Badge>
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEntry(entry.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        {/* Info Box */}
        <Alert>
          <AlertDescription className="text-xs">
            <strong>How it works:</strong> The Schengen Area allows visa-free travel for up to 90 days 
            within any 180-day period. The 180-day period keeps rolling backwards, so each day that passes, 
            a new day is added to the calculation period.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
