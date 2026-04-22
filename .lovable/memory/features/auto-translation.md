---
name: Auto-Translation System
description: Build-time AI fill script + runtime safety net that auto-translates any unknown UI string to the user's language across all 13 supported languages
type: feature
---

## Languages (13)
en, es, pt, zh, fr, de, ar, ja, it, ko, hi, ru, tr — defined in `LanguageContext.tsx` and `useVoiceConversation.ts` (LANG_TO_LOCALE).

## Build-time fill script
- `scripts/translation-audit.mjs` — parses `LanguageContext.tsx`, reports per-language completeness, optionally fills missing keys via Lovable AI Gateway.
- Run: `node scripts/translation-audit.mjs` (audit only) or `--fill` (auto-translate).
- As of 2026-04-22: all 13 languages at 100% for the 185 LanguageContext keys + commonTranslations.

## Runtime safety net (NEW)
- Edge function: `supabase/functions/translate-ui/index.ts` — Lovable AI translation (gemini-2.5-flash) with 30-day cache in `ai_cache` table.
- Client utility: `src/utils/autoTranslate.ts` — exports `translateText`, `translateBatch`, `useAutoTranslate(text)` hook. 3-layer cache: in-memory → localStorage → server.
- LanguageContext.tsx `t()` function: returns key/English instantly, kicks off background AI translation for unknown keys, re-renders when ready. Zero hardcoded English shows up to non-English users.

## AI advisors honor user language
All edge functions (travel-assistant, travel-planner, legal-chat, medical-chat, concierge-actions) accept `userContext.language` and have explicit "respond ENTIRELY in this language" instructions in their system prompts.

## Voice (STT + TTS)
`useVoiceConversation` maps all 13 app languages to native browser locales (en-US, es-ES, pt-BR, zh-CN, fr-FR, de-DE, ar-SA, ja-JP, it-IT, ko-KR, hi-IN, ru-RU, tr-TR). VoiceControlContext FEEDBACK_MESSAGES has all 13.
