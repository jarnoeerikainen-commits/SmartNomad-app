# SuperNomad Feature Governance

> Goal: keep the main SuperNomad brand stable while feature brands, app modules, mobile surfaces, back office, AI, and backend work can evolve safely.

## Protected main brand

These areas are protected by default and must not change unless the request explicitly asks for brand/core work:

- Landing site and primary public routes: `src/pages/Landing.tsx`, `src/pages/Index.tsx`, `src/App.tsx`
- Main brand shell: `src/components/AppHeader.tsx`, app navigation, logo usage, global voice entry points
- Design system foundation: `src/index.css`, `tailwind.config.ts`, `src/components/ui/*`
- Supabase generated types: `src/integrations/supabase/types.ts` stays read-only
- Auth, role checks, RLS, and admin access patterns

## Feature-brand build rule

Every feature brand should be built as an isolated module:

1. **Own folder** for feature components, services, tests, fixtures, and assets.
2. **Narrow route or entrypoint** connected to existing navigation only when ready.
3. **Feature flag or safe fallback** for risky, AI, backend, or partner integrations.
4. **No direct edits to protected core** unless the request specifically includes that change.
5. **Voice control parity** when a feature adds navigation or user-facing actions.
6. **Mobile-first QA** for scroll, safe-area, text readability, and no stuck loading states.

## Backend and AI safety

- Use edge functions for secrets, AI prompts, external API calls, and privileged actions.
- Never call AI providers or private APIs directly from the client.
- Surface 402/429/5xx errors clearly and keep the UI usable.
- Log AI model, cost estimate, latency, status, input/output token estimates, and proof references where available.
- Roles stay in `user_roles`; never store roles on profiles or browser storage.

## Audit packet for each feature

Each feature should be reviewable with:

- Scope and protected files touched, if any
- Changed files grouped by website, app, back office, backend, AI, mobile, tests
- Data sources and verification notes
- Security/RLS impact
- Voice/navigation impact
- Tests and build commands run
- Known limitations or follow-up items

## Required checks before completion

Run the checks relevant to the work:

```sh
bun run governance:check
bunx vitest run <targeted tests>
bun run build
```

For edge functions, also run targeted Supabase edge function tests and review function logs when debugging runtime errors.
