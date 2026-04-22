/**
 * CalendarReminderBoot — mounts once at the app shell level. Boots the
 * minute-tick reminder engine for the active persona/user and listens for
 * the cross-app reminder events the engine dispatches:
 *
 *   • supernomad:concierge-push  → forward to Concierge chat (proactive msg)
 *   • supernomad:concierge-speak → speak via TTS if voice mode is enabled
 *   • supernomad:toast           → show in-app toast
 *
 * No UI of its own — pure wiring component.
 */

import { useEffect } from 'react';
import { toast } from 'sonner';
import { useDemoPersona } from '@/contexts/DemoPersonaContext';
import {
  startReminderEngine,
  stopReminderEngine,
  setReminderEnginePersona,
  getCalendarPrefs,
} from '@/services/CalendarReminderEngine';

const CalendarReminderBoot: React.FC = () => {
  const { activePersonaId } = useDemoPersona();

  // Boot once + keep persona scope in sync
  useEffect(() => {
    startReminderEngine(activePersonaId ?? null);
    setReminderEnginePersona(activePersonaId ?? null);

    // Ask for browser-notification permission once if user has toast enabled
    try {
      const prefs = getCalendarPrefs();
      if (
        prefs.enabledChannels.includes('toast') &&
        typeof window !== 'undefined' &&
        'Notification' in window &&
        Notification.permission === 'default'
      ) {
        // Defer slightly so we don't blast the user the moment app opens
        const t = setTimeout(() => {
          Notification.requestPermission().catch(() => undefined);
        }, 8_000);
        return () => clearTimeout(t);
      }
    } catch {
      /* ignore */
    }
  }, [activePersonaId]);

  // Cleanup on unmount (mostly hot-reload safety)
  useEffect(() => () => stopReminderEngine(), []);

  // Toast bridge — engine fires 'supernomad:toast'
  useEffect(() => {
    const onToast = (e: Event) => {
      const detail = (e as CustomEvent<{ title?: string; description?: string }>).detail;
      if (!detail) return;
      toast(detail.title || 'Reminder', {
        description: detail.description,
        duration: 8000,
      });
    };
    window.addEventListener('supernomad:toast', onToast as EventListener);
    return () => window.removeEventListener('supernomad:toast', onToast as EventListener);
  }, []);

  // Voice bridge — engine fires 'supernomad:concierge-speak' with { text }
  // We rebroadcast as a tts-friendly event the AITravelAssistant can pick up.
  useEffect(() => {
    const onSpeak = (e: Event) => {
      const detail = (e as CustomEvent<{ text?: string }>).detail;
      if (!detail?.text) return;
      // Try Web Speech API as a universal fallback (works even if concierge is closed)
      try {
        const synth = window.speechSynthesis;
        if (synth && !synth.speaking) {
          const utter = new SpeechSynthesisUtterance(detail.text);
          utter.rate = 1;
          utter.pitch = 1;
          utter.volume = 0.9;
          synth.speak(utter);
        }
      } catch {
        /* ignore */
      }
    };
    window.addEventListener('supernomad:concierge-speak', onSpeak as EventListener);
    return () =>
      window.removeEventListener('supernomad:concierge-speak', onSpeak as EventListener);
  }, []);

  return null;
};

export default CalendarReminderBoot;
