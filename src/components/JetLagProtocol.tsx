import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Moon, Sun, Coffee, Pill, Droplets, Eye, Clock, Plane,
  BedDouble, Utensils, Activity, ChevronRight, Sparkles, Heart
} from 'lucide-react';

interface CityTimezone {
  city: string;
  timezone: string;
  utcOffset: number;
}

const CITIES: CityTimezone[] = [
  { city: 'New York', timezone: 'EST', utcOffset: -5 },
  { city: 'Los Angeles', timezone: 'PST', utcOffset: -8 },
  { city: 'London', timezone: 'GMT', utcOffset: 0 },
  { city: 'Paris', timezone: 'CET', utcOffset: 1 },
  { city: 'Dubai', timezone: 'GST', utcOffset: 4 },
  { city: 'Mumbai', timezone: 'IST', utcOffset: 5.5 },
  { city: 'Bangkok', timezone: 'ICT', utcOffset: 7 },
  { city: 'Singapore', timezone: 'SGT', utcOffset: 8 },
  { city: 'Tokyo', timezone: 'JST', utcOffset: 9 },
  { city: 'Sydney', timezone: 'AEST', utcOffset: 10 },
  { city: 'Lisbon', timezone: 'WET', utcOffset: 0 },
  { city: 'Bali', timezone: 'WITA', utcOffset: 8 },
];

interface ProtocolStep {
  time: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  category: 'light' | 'supplement' | 'meal' | 'sleep' | 'activity';
}

function generateProtocol(from: CityTimezone, to: CityTimezone): { steps: ProtocolStep[]; severity: string; recoveryDays: number; direction: string } {
  const diff = to.utcOffset - from.utcOffset;
  const absDiff = Math.abs(diff);
  const direction = diff > 0 ? 'east' : 'west';
  const recoveryDays = Math.ceil(absDiff / 1.5);
  const severity = absDiff <= 3 ? 'Mild' : absDiff <= 6 ? 'Moderate' : absDiff <= 9 ? 'Severe' : 'Extreme';

  const steps: ProtocolStep[] = [];

  // Pre-flight
  steps.push({
    time: '48h before',
    icon: <Clock className="h-4 w-4" />,
    title: `Shift sleep ${direction === 'east' ? 'earlier' : 'later'}`,
    description: `Move bedtime ${Math.min(absDiff, 3)} hours ${direction === 'east' ? 'earlier' : 'later'} over 2 days.`,
    category: 'sleep',
  });

  if (absDiff >= 5) {
    steps.push({
      time: '24h before',
      icon: <Pill className="h-4 w-4" />,
      title: 'Start melatonin pre-shift',
      description: `Take 0.5mg melatonin at ${direction === 'east' ? '8 PM' : '11 PM'} local time to pre-adjust circadian rhythm.`,
      category: 'supplement',
    });
  }

  // In-flight
  steps.push({
    time: 'In-flight',
    icon: <Plane className="h-4 w-4" />,
    title: 'Set watch to destination time',
    description: 'Eat and sleep according to destination schedule. Use eye mask for "night" periods.',
    category: 'activity',
  });

  if (absDiff >= 4) {
    steps.push({
      time: 'In-flight',
      icon: <Droplets className="h-4 w-4" />,
      title: 'Hydration protocol',
      description: 'Drink 250ml water every 2 hours. Avoid alcohol and caffeine 6h before destination "bedtime."',
      category: 'meal',
    });
  }

  // Arrival day
  if (direction === 'east') {
    steps.push({
      time: 'Arrival AM',
      icon: <Sun className="h-4 w-4" />,
      title: 'Bright light exposure',
      description: `Get 30min direct sunlight between 8-10 AM destination time. This is the #1 circadian reset signal.`,
      category: 'light',
    });
  } else {
    steps.push({
      time: 'Arrival PM',
      icon: <Sun className="h-4 w-4" />,
      title: 'Afternoon light exposure',
      description: `Get 30min sunlight between 3-5 PM destination time. Avoid morning light to delay your clock.`,
      category: 'light',
    });
  }

  steps.push({
    time: 'Arrival',
    icon: <Utensils className="h-4 w-4" />,
    title: 'Chrono-nutrition meal',
    description: 'High-protein breakfast at destination morning. Carb-rich dinner to promote evening sleepiness.',
    category: 'meal',
  });

  if (absDiff >= 6) {
    steps.push({
      time: 'Arrival',
      icon: <Droplets className="h-4 w-4" />,
      title: 'Recovery IV Drip available',
      description: 'Book a Jet Lag IV Drip (B-vitamins, magnesium, glutathione) at your hotel or nearby wellness clinic.',
      category: 'supplement',
    });
  }

  steps.push({
    time: 'Arrival 9 PM',
    icon: <Moon className="h-4 w-4" />,
    title: `Melatonin at destination bedtime`,
    description: `Take ${absDiff >= 6 ? '3mg' : '1mg'} melatonin 30 min before desired sleep time. Dark room, 18°C.`,
    category: 'supplement',
  });

  if (absDiff >= 5) {
    steps.push({
      time: 'Arrival',
      icon: <BedDouble className="h-4 w-4" />,
      title: 'Sleep Suite recommendation',
      description: 'Book a hotel with blackout curtains, sleep-optimized mattress, and white noise. Avoid screens 1h before bed.',
      category: 'sleep',
    });
  }

  // Day 2+
  steps.push({
    time: 'Day 2-3',
    icon: <Activity className="h-4 w-4" />,
    title: 'Morning exercise',
    description: '20 min light cardio before 10 AM. Exercise anchors circadian rhythm via core temperature cycling.',
    category: 'activity',
  });

  if (absDiff >= 8) {
    steps.push({
      time: 'Day 2-4',
      icon: <Coffee className="h-4 w-4" />,
      title: 'Strategic caffeine windows',
      description: 'Coffee only between 9-11 AM destination time. No caffeine after 2 PM to protect sleep architecture.',
      category: 'meal',
    });
    steps.push({
      time: 'Day 3-5',
      icon: <Eye className="h-4 w-4" />,
      title: 'Light therapy glasses',
      description: 'Use 10,000 lux light therapy for 20 min each morning to accelerate circadian entrainment.',
      category: 'light',
    });
  }

  return { steps, severity, recoveryDays, direction };
}

const CATEGORY_COLORS: Record<string, string> = {
  light: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  supplement: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  meal: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  sleep: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  activity: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
};

const SEVERITY_COLORS: Record<string, string> = {
  Mild: 'bg-green-500/10 text-green-700 border-green-500/30',
  Moderate: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/30',
  Severe: 'bg-orange-500/10 text-orange-700 border-orange-500/30',
  Extreme: 'bg-red-500/10 text-red-700 border-red-500/30',
};

const JetLagProtocol: React.FC = () => {
  const [fromCity, setFromCity] = useState('New York');
  const [toCity, setToCity] = useState('Tokyo');

  const from = CITIES.find(c => c.city === fromCity)!;
  const to = CITIES.find(c => c.city === toCity)!;

  const protocol = useMemo(() => generateProtocol(from, to), [from, to]);
  const timeDiff = to.utcOffset - from.utcOffset;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-primary/10">
            <Moon className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Jet Lag Protocol</h1>
            <p className="text-muted-foreground">Circadian bio-hacking for optimal recovery</p>
          </div>
        </div>
      </div>

      {/* Route Selector */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 w-full">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">From</label>
              <Select value={fromCity} onValueChange={setFromCity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CITIES.map(c => (
                    <SelectItem key={c.city} value={c.city}>
                      {c.city} ({c.timezone}, UTC{c.utcOffset >= 0 ? '+' : ''}{c.utcOffset})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <ChevronRight className="h-5 w-5 text-muted-foreground hidden sm:block mt-4" />
            <Plane className="h-5 w-5 text-muted-foreground sm:hidden" />

            <div className="flex-1 w-full">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">To</label>
              <Select value={toCity} onValueChange={setToCity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CITIES.map(c => (
                    <SelectItem key={c.city} value={c.city}>
                      {c.city} ({c.timezone}, UTC{c.utcOffset >= 0 ? '+' : ''}{c.utcOffset})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Card className="p-3 text-center">
          <div className="text-2xl font-bold text-primary">{Math.abs(timeDiff)}h</div>
          <div className="text-xs text-muted-foreground">Time Shift</div>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-2xl font-bold">{protocol.direction === 'east' ? '→ East' : '← West'}</div>
          <div className="text-xs text-muted-foreground">Direction</div>
        </Card>
        <Card className="p-3 text-center">
          <Badge className={SEVERITY_COLORS[protocol.severity]} variant="outline">{protocol.severity}</Badge>
          <div className="text-xs text-muted-foreground mt-1">Severity</div>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-2xl font-bold text-primary">{protocol.recoveryDays}</div>
          <div className="text-xs text-muted-foreground">Recovery Days</div>
        </Card>
      </div>

      {/* Protocol Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Your Personalized Recovery Protocol
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {protocol.steps.map((step, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="flex flex-col items-center">
                  <div className={`p-2 rounded-lg border ${CATEGORY_COLORS[step.category]}`}>
                    {step.icon}
                  </div>
                  {i < protocol.steps.length - 1 && (
                    <div className="w-px h-full min-h-[20px] bg-border mt-1" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-2 mb-0.5">
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">{step.time}</Badge>
                    <span className="font-semibold text-sm">{step.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pro Tips */}
      <Card className="mt-6 border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">SuperNomad Pro Tips</h3>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• <strong>East is harder:</strong> Flying east requires advancing your clock, which is biologically harder than delaying it.</li>
            <li>• <strong>1 day per timezone:</strong> Full adaptation takes ~1 day per hour of time difference.</li>
            <li>• <strong>Anchor sleep:</strong> Even if you can't sleep a full night, get at least 4h of "anchor sleep" at destination bedtime.</li>
            <li>• <strong>Avoid naps &gt;20 min:</strong> Short power naps are OK, but long naps will delay adaptation.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default JetLagProtocol;
