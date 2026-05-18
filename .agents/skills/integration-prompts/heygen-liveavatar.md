# HeyGen LiveAvatar (liveavatar)

## Secrets
- `HEYGEN_API_KEY`

## Auth
`X-Api-Key: ${HEYGEN_API_KEY}`

## Endpoints
- `GET /v1/avatars/public?page=1&page_size=50` — list avatars
- `POST /v1/sessions/token` — `{ avatar_id, voice_id, quality }` → `{ token, session_id }`
- `POST /v1/sessions/start` — `{ session_id }` → `{ url }` (LiveKit room)
- `POST /v1/sessions/stop` — `{ session_id }`

## Already wired
`supabase/functions/liveavatar-session/index.ts` — just add the secret.

## Memory ties
Per Avatar System memory: single-avatar UI, mouth-tracking TTS, chat-panel sizing fixed.

## Activation prompt
> Activate HeyGen. Add `HEYGEN_API_KEY`. Verify `liveavatar-session` POST returns a session URL and the avatar's mouth syncs with ElevenLabs stream (handled in `hooks/voice/elevenLabsStream.ts`).
