# Twilio Voice (twilio-voice)

## Secrets
- `TWILIO_API_KEY` (connector-stored)
- `TWILIO_PHONE_NUMBER` (the From number)
- `LOVABLE_API_KEY` (gateway auth)

## Auth
Routed via `https://connector-gateway.lovable.dev/twilio/...` — pass:
```
Authorization: Bearer <LOVABLE_API_KEY>
X-Connection-Api-Key: <TWILIO_API_KEY>
```

## Endpoints
- `POST /twilio/Calls.json` form-body `{ To, From, Url }` (TwiML for script)
- `GET /twilio/Calls/{sid}.json` — poll status.

## Demo→Live diff
Already wired in `concierge-actions/handlePhoneCall()`. Replace with:
```ts
await callProvider({
  integrationKey: "twilio-voice",
  providerId: "twilio",
  demo: () => generateDemoTranscript(payload),
  live: async ({ secrets, fetch }) => {
    const r = await fetch("https://connector-gateway.lovable.dev/twilio/Calls.json", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secrets.LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": secrets.TWILIO_API_KEY,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        To: payload.phone,
        From: secrets.TWILIO_PHONE_NUMBER,
        Url: "http://demo.twilio.com/docs/voice.xml",
      }),
    });
    return await r.json();
  },
});
```

## Activation
1. Add secrets above.
2. Toggle DB: `UPDATE app_settings SET real_calling_enabled = true WHERE id = 1;`
3. Require Danger Gate confirmation for any unverified destination.

## Activation prompt
> Activate Twilio outbound calls. Use existing wiring in `concierge-actions` but route through `callProvider({ integrationKey: "twilio-voice" })`. Block calls when `is_real_calling_enabled()` returns false.
