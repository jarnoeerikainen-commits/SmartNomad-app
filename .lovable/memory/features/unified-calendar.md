# Unified Calendar Ecosystem

The SuperNomad Calendar is the single timeline that the entire app reads
from and writes to: bookings, appointments, sports, meals, AI proposals,
demo personas. Reminders fire across chat, voice, in-app toast, and email.

## Architecture

```
                    ┌────────────────────────────┐
                    │   AI Concierge replies     │
                    │   (```calendar JSON)       │
                    └──────────────┬─────────────┘
                                   │ parsed by
                                   ▼
            calendarProposalParser → CalendarProposalCards
                                   │ user taps "Add to calendar"
                                   ▼
   Booking flows (flight, hotel, restaurant, sport, appointment)
            via CalendarBookingBridge.addBookingToCalendar(...)
                                   │
                                   ▼
                       ┌──────────────────────┐
                       │   CalendarService    │  ← localStorage source of truth
                       │  (per persona/user)  │     dispatches `supernomad:calendar`
                       └──────────┬───────────┘
                                  │
        ┌─────────────────────────┼───────────────────────────┐
        ▼                         ▼                           ▼
  useCalendar()         CalendarReminderEngine        briefForAI() injected
  (UI hook)             (1-min tick scheduler)        into concierge prompt
                                  │
              fires reminders via window CustomEvents:
              • supernomad:concierge-push  → chat thread
              • supernomad:concierge-speak → TTS + Web Speech fallback
              • supernomad:toast           → sonner + browser Notification
              • email                      → Supabase fn `send-calendar-reminder`
```

## Files

| File | Role |
|------|------|
| `src/types/calendarEvent.ts` | Event/Proposal/Reminder types + DEFAULT_REMINDERS ladder |
| `src/services/CalendarService.ts` | localStorage CRUD, demo seeding, AI brief |
| `src/services/CalendarReminderEngine.ts` | Minute-tick scheduler, prefs, fire logic |
| `src/services/CalendarBookingBridge.ts` | Helpers for booking flows to add events |
| `src/utils/calendarProposalParser.ts` | Parses ` ```calendar ` JSON blocks |
| `src/components/chat/CalendarProposalCards.tsx` | Confirm UI in chat thread |
| `src/components/calendar/CalendarReminderBoot.tsx` | Mounts engine + event bridges |
| `src/components/calendar/CalendarSettingsCard.tsx` | User prefs UI (channels/mute/email/AI auto-write) |
| `src/hooks/useCalendar.ts` | React hook for components |
| `supabase/functions/send-calendar-reminder/index.ts` | Email reminders (Resend or simulated) |

## User-facing rules (per product decisions)

* **Calendar provider:** internal SuperNomad calendar only. No OAuth sync.
* **Writes:** read-only by default. AI must always ask via a confirm card
  unless the user explicitly enables `aiAutoWrite`.
* **Reminder channels:** chat (proactive), voice (TTS), toast/push, email.
* **Demo personas:** Meghan & John get their static calendars seeded into
  the same ecosystem so the reminder UX is demoable end-to-end.

## How AI proposes events

The concierge emits a fenced block in its reply:

```calendar
{
  "title": "Doctor — Mayo Clinic",
  "start": "2026-05-12T14:30",
  "end":   "2026-05-12T15:30",
  "category": "wellness",
  "location": "Mayo Clinic, Rochester",
  "notes": "Bring vaccination record",
  "reminders": [
    { "minutesBefore": 1440, "channels": ["chat","email"] },
    { "minutesBefore": 60,   "channels": ["chat","toast"] }
  ]
}
```

The parser extracts these blocks, replaces them with `{{CALENDAR_PROPOSAL_n}}`
tokens, and the chat renders `<CalendarProposalCards>` inline. The user taps
"Add to calendar" → `CalendarService.confirmProposal` writes it.

## Reminder timing rules

* Each `ReminderRule.minutesBefore` is evaluated every minute by the engine.
* A rule fires once and is marked `fired: true` (idempotent across tabs).
* Reminders >24h old are skipped on first load (no historical spam).
* Reminders fired more than 1h after event start are also skipped.
* Email reminders only fire if `minutesBefore >= 60` to avoid spam.

## Categories → default reminder ladders

Defined in `DEFAULT_REMINDERS` (calendarEvent.ts). Examples:
* `travel`: 24h, 3h, 1h before
* `meeting`: 1h, 10 min before
* `meal`: 90 min, 20 min before
* `sport` / `wellness`: 1h, 15 min before
* `legal`: 7 days, 24h before
* `birthday`: 24h before (chat + email)

## Adding a new booking type

1. Pick the right `CalendarEventCategory`.
2. Add a wrapper to `CalendarBookingBridge.ts` that maps the booking shape
   to `addBookingToCalendar(...)`.
3. Call the wrapper inside the booking flow's confirm handler — never on
   page load, never silently.
