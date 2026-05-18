# Generic stub — fill in per provider

> Used as the template for all `planned` integrations that don't have a
> dedicated file yet. Copy this to `<integration-key>.md` and fill in.

## Secrets
- `…`

## Auth
…

## Endpoints
- `METHOD URL` — purpose, request schema, response schema

## Demo→Live diff
```ts
await callProvider({
  integrationKey: "<key>",
  providerId: "<provider>",
  demo: () => ({ source: "demo" }),
  live: async ({ secrets, fetch }) => { /* TODO */ },
});
```

## Tests
- Sandbox key call
- Schema mapper unit test

## Activation prompt
> Activate <key>. Read this file. Implement live branch. Flip registry mode to "live". Add tests.
