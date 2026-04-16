---
name: Concierge Action Mode
description: Real-world action execution — phone calls, reservations, document auto-fill, and form completion via ActionCards in chat
type: feature
---

## Concierge Action Mode

### ActionCards (Chat Integration)
- `src/components/chat/ActionCards.tsx` — renders action cards in chat with animated status progression (pending → in-progress → completed)
- Supports types: `phone-call`, `document-fill`, `reservation`, `payment`, `form-submit`, `appointment`
- Phone calls show real-time waveform animation and simulated transcript
- Parser: `parseActionBlocks()` detects ```action JSON blocks in AI responses
- Integrated into both mobile and desktop chat renderers in `AITravelAssistant.tsx`

### Document Auto-Fill
- `src/components/DocumentAutoFill.tsx` — standalone page for auto-filling travel/tax documents
- 7 templates: Schengen Visa, US ESTA, EU ETIAS, India e-Visa, Customs Declaration, Tax Residency Certificate, US W-8BEN
- Auto-fills from demo persona profile data via `autoFillKey` mapping
- Download as draft text file; links to official government portals
- Routed as `document-auto-fill` in sidebar under Tax & Compliance

### Edge Function (concierge-actions)
- `supabase/functions/concierge-actions/index.ts` — API-ready action execution engine
- Demo mode: returns simulated results with realistic transcripts
- Production mode: Twilio-ready phone calls via connector gateway
- Handles: phone-call, reservation, document-fill, appointment
