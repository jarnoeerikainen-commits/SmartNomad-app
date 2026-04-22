/**
 * CalendarSettingsCard — user-facing controls for the unified calendar
 * reminder ecosystem. Lives inside the Settings screen / concierge panel.
 *
 * Surfaces every preference the CalendarReminderEngine reads:
 *   • Channel toggles (chat / voice / toast / email)
 *   • Mute switch (kill all reminders without losing prefs)
 *   • Email field (used for email reminders >1h ahead)
 *   • AI auto-write switch (per the "ask before every write" decision,
 *     defaults to OFF — when ON, the concierge is allowed to write events
 *     without an explicit confirm card. Most users should keep OFF.)
 */

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Bell, MessageSquare, Mic, Mail, BellOff, Bot } from 'lucide-react';
import {
  getCalendarPrefs,
  setCalendarPrefs,
  CalendarPreferences,
} from '@/services/CalendarReminderEngine';
import { ReminderChannel } from '@/types/calendarEvent';

const CHANNELS: { key: ReminderChannel; label: string; icon: React.ComponentType<{ className?: string }>; helper: string }[] = [
  { key: 'chat', label: 'Concierge chat', icon: MessageSquare, helper: 'Proactive messages in your chat thread.' },
  { key: 'voice', label: 'Voice reminders', icon: Mic, helper: 'Spoken aloud when voice mode is active.' },
  { key: 'toast', label: 'In-app toast & push', icon: Bell, helper: 'Banner alerts inside the app + browser notifications.' },
  { key: 'email', label: 'Email reminders', icon: Mail, helper: 'For events ≥1 hour away. Avoid spam.' },
];

const CalendarSettingsCard: React.FC = () => {
  const [prefs, setPrefs] = useState<CalendarPreferences>(() => getCalendarPrefs());

  useEffect(() => {
    const refresh = () => setPrefs(getCalendarPrefs());
    window.addEventListener('supernomad:calendar-prefs', refresh);
    return () => window.removeEventListener('supernomad:calendar-prefs', refresh);
  }, []);

  const toggleChannel = (channel: ReminderChannel, enabled: boolean) => {
    const next = enabled
      ? Array.from(new Set([...prefs.enabledChannels, channel]))
      : prefs.enabledChannels.filter((c) => c !== channel);
    setPrefs(setCalendarPrefs({ enabledChannels: next }));
  };

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Bell className="h-4 w-4 text-primary" />
          Calendar reminders
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Choose how SuperNomad reminds you about flights, meetings, sports, dining, and AI-confirmed events.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Mute master switch */}
        <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
          <div className="flex items-center gap-3">
            <BellOff className="h-4 w-4 text-muted-foreground" />
            <div>
              <Label className="text-sm font-medium">Mute all reminders</Label>
              <p className="text-xs text-muted-foreground">Pause without losing your settings.</p>
            </div>
          </div>
          <Switch
            checked={!!prefs.muted}
            onCheckedChange={(v) => setPrefs(setCalendarPrefs({ muted: v }))}
          />
        </div>

        <Separator />

        {/* Channel toggles */}
        <div className="space-y-3">
          {CHANNELS.map(({ key, label, icon: Icon, helper }) => (
            <div key={key} className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <Label className="text-sm font-medium">{label}</Label>
                  <p className="text-xs text-muted-foreground">{helper}</p>
                </div>
              </div>
              <Switch
                checked={prefs.enabledChannels.includes(key)}
                onCheckedChange={(v) => toggleChannel(key, v)}
                disabled={prefs.muted}
              />
            </div>
          ))}
        </div>

        {/* Email address — only visible if email channel enabled */}
        {prefs.enabledChannels.includes('email') && (
          <div className="space-y-1.5">
            <Label htmlFor="cal-email" className="text-xs">Email for reminders</Label>
            <Input
              id="cal-email"
              type="email"
              placeholder="you@example.com"
              value={prefs.email ?? ''}
              onChange={(e) => setPrefs(setCalendarPrefs({ email: e.target.value }))}
              className="h-9 text-sm"
            />
          </div>
        )}

        <Separator />

        {/* AI auto-write */}
        <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
          <div className="flex items-center gap-3">
            <Bot className="h-4 w-4 text-muted-foreground" />
            <div>
              <Label className="text-sm font-medium">Let AI write to calendar</Label>
              <p className="text-xs text-muted-foreground">
                Off by default. When off, the Concierge always asks before adding events.
              </p>
            </div>
          </div>
          <Switch
            checked={!!prefs.aiAutoWrite}
            onCheckedChange={(v) => setPrefs(setCalendarPrefs({ aiAutoWrite: v }))}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarSettingsCard;
