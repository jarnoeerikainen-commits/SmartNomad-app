# ElevenLabs TTS (elevenlabs-tts)

## Secret
- `ELEVENLABS_API_KEY`

## Auth
`xi-api-key: ${ELEVENLABS_API_KEY}`

## Endpoints
- `POST /v1/text-to-speech/{voice_id}/stream` — body `{ text, model_id, voice_settings: { stability, similarity_boost } }`
- `GET /v1/voices` — list voices.

## Personality memory
Male concierge voice with specific pitch/rate (see Personality Modes memory).

## Already wired
`supabase/functions/elevenlabs-tts/index.ts` + `hooks/voice/elevenLabsStream.ts`.

## Activation prompt
> Confirm live. If voice id drifts, update VOICE_ID in `elevenlabs-tts/index.ts` to match Personality Modes memory.
