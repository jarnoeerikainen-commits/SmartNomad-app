# Travel Inbox OAuth (email-oauth)

## Secrets
- Google: `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`
- Microsoft: `MS_OAUTH_CLIENT_ID`, `MS_OAUTH_CLIENT_SECRET`

## Already wired
`supabase/functions/email-oauth-exchange/index.ts` exchanges code → tokens
and pulls userinfo (`googleapis.com/oauth2/v2/userinfo` or `graph.microsoft.com/v1.0/me`).

## Scopes
- Google: `openid email https://www.googleapis.com/auth/gmail.readonly`
- Microsoft: `openid email offline_access Mail.Read`

## DB
Tokens stored in `oauth_connections` table, refreshed via cron / on-demand.

## Activation prompt
> Confirm live. Set OAuth redirect URIs to `https://<app-domain>/auth/callback/{google|microsoft}`. Add background job to scan inbox for "booking confirmation" patterns → upsert into `travel_history`.
