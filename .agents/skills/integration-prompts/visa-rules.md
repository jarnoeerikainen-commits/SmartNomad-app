# Visa & Border Rules (visa-rules)

## Secrets
- Sherpa°: `SHERPA_API_KEY`
- iVisa: `IVISA_API_KEY`

## Sherpa endpoints
- `GET https://requirements-api.joinsherpa.com/v2/entry-requirements?citizenship={ISO}&destination={ISO}&key={SHERPA_API_KEY}`
- Returns visa + vaccination + entry forms.

## Demo→Live diff
```ts
await callProvider({
  integrationKey: "visa-rules",
  providerId: "sherpa",
  demo: () => DEMO_VISA_RULES,
  live: async ({ secrets, fetch }) => {
    const r = await fetch(`https://requirements-api.joinsherpa.com/v2/entry-requirements?citizenship=${cit}&destination=${dst}&key=${secrets.SHERPA_API_KEY}`);
    return (await r.json()).data;
  },
});
```

## Activation prompt
> Activate visa rules via Sherpa. Replace demo in `VisaAutoMatcherService.ts` consumers. Cache 24h. Always show `_source` badge.
