---
name: Trust Pass (walt.id integration)
description: 3-tier verifiable credential system (Human/Nomad/Sovereign) with demo mode and production walt.id scaffold
type: feature
---

Trust Pass = SuperNomad's verification moat, powered by walt.id (W3C SD-JWT-VC, OID4VC, eIDAS 2.0).

## Tiers
- **Human** 🥉 — Biometric Liveness only (anti-bot, anti-deepfake)
- **Nomad** 🥈 — + Location + TravelHistory (unlocks elite city chats, Vibe-Match)
- **Sovereign** 🥇 — + ProofOfFunds + ProfessionalCredential (Marketplace seller, Investor channels, Sovereign Escrow)

## Demo vs Live
Controlled by `VITE_VERIFICATION_MODE` env var (default `demo`). Demo simulates everything client-side via `TrustPassService` + localStorage. Live mode calls `walt-id-verifier` edge function.

## Wired into
- `TrustPassDashboard` (sidebar: Trust Pass, premium category, pinned)
- `NomadChatDashboard` Pulse — "Verified Only" toggle, TrustBadge on Match/Nearby cards, Vibe-Match score
- `Marketplace ItemCard` — TrustBadge on seller, "Sovereign Hold" warning if unverified
- Edge function: `walt-id-verifier` with commented OID4VC issuance + verification flows

## Demo helpers
- `getDemoTierForId(id)` — deterministic 15/35/35/15 tier distribution
- `getDemoVibeScore(myId, theirId)` — 60-99 range Vibe-Match
- One-time $20 Trust Pass fee gate (free in demo)

## Real-version cost
walt.id Community Stack = $0 (self-hosted). Onfido liveness = ~$2/check. Recovered via $20 one-time fee.
