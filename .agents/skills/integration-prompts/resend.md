# Resend Email (resend-email)

## Secrets
- `RESEND_API_KEY` (re_…)
- (optional) verified sending domain set in Resend dashboard

## Auth
`Authorization: Bearer ${RESEND_API_KEY}`

## Endpoints
- `POST https://api.resend.com/emails`
  body `{ from, to: string[], subject, html, text?, reply_to?, tags? }`

## Use cases
- Org invites (`org-management`)
- Calendar reminders (`send-calendar-reminder`)
- Weekly nomad reports
- Visa expiry warnings
- Tax day notifications

## Demo→Live diff
```ts
await callProvider({
  integrationKey: "resend-email",
  providerId: "resend",
  demo: () => ({ id: `demo-${Date.now()}`, queued: true, source: "demo" }),
  live: async ({ secrets, fetch }) => {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secrets.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, html }),
    });
    return await r.json();
  },
});
```

## Templates
Scaffold via `email_domain--scaffold_transactional_email` tool.

## Activation prompt
> Activate Resend transactional email. Replace TODOs in `org-management/index.ts` (invite emails) and add to `send-calendar-reminder`. Use `callProvider({ integrationKey: "resend-email" })`.
