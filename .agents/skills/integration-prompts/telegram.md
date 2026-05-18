# Telegram Bot (telegram-bot)

## Secret
- `TELEGRAM_BOT_TOKEN`

## Endpoints
- `POST https://api.telegram.org/bot{TOKEN}/sendMessage` body `{ chat_id, text, parse_mode: "MarkdownV2" }`

## Onboarding
User starts the bot → bot captures `chat_id` → user pastes a code in app to link.
Persist `{user_id, telegram_chat_id}` in `notification_channels` table.

## Activation prompt
> Add `TELEGRAM_BOT_TOKEN`. Create `telegram-notify` edge function. Hook into `threat-intel` alert pipeline for opted-in users.
