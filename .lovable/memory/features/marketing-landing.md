---
name: Marketing Landing Page (Plan A)
description: Cinematic landing at /, app moved to /app, BackToWebsiteButton pill on all non-landing routes
type: feature
---

## Marketing landing page architecture (Apr 2026)

### Routing
- `/` → `src/pages/Landing.tsx` (cinematic marketing site)
- `/app` → existing `Index.tsx` (full SuperNomad app, demo + production-ready)
- All other routes (`/auth`, `/business-centers`, `/wifi-finder`, `/terms`, `/privacy-policy`, `/translation-manager`, `/reset-password`) unchanged
- `BackToWebsiteButton` (fixed bottom-left pill, z-60) renders on every route EXCEPT `/` via `ConditionalBackButton` in `App.tsx`

### Landing structure (top → bottom)
1. Sticky transparent nav (logo + anchors + Launch App)
2. Hero — full-bleed `landing-hero.jpg` + logo card, gold gradient headline, dual CTA, trust badges
3. 184th Day section — uses uploaded `landing-184th-day.jpg`, 4 stat cards
4. Pain → Fix (4 cards: Tax, Visa, Loneliness, Security)
5. Ecosystem — 10 feature tiles + 3 cinematic photo strips (Travel/Identity/Local Living)
6. How it works — 3 numbered steps
7. Lifestyle — padel/cycling/golf
8. Why SuperNomad — 4 differentiators
9. Pricing — Free vs Premium $4.99
10. Trust & Compliance (#trust) — AES-256, GDPR Art. 17, Zero-Knowledge, CCPA + demo notice + advisor disclaimer
11. App Store / Google Play — "Coming soon" disabled badges (per user choice)
12. Final mega-CTA with logo
13. Footer — Privacy, Terms, compliance line, © 2026

### Assets in `src/assets/`
- `supernomad-logo.jpg` (uploaded by user)
- `landing-184th-day.jpg` (uploaded by user)
- `landing-hero.jpg`, `landing-community.jpg`, `landing-security.jpg`, `landing-travel.jpg`, `landing-lifestyle.jpg` (generated standard-tier)

### Visual system
- Dark midnight bg `hsl(220 22% 8%)`, gold accent via existing `--gold` / `--gold-light` / `--gold-dark` tokens, `--shadow-glow-gold`
- Playfair Display (display) + Inter (body) — already loaded in `index.html`
- No cookie banner (per user choice — relies on prominent footer privacy link)
- Store buttons render disabled ("Coming soon") — user will swap URLs later

### Key UX rules
- Landing has zero auth requirement; demo mode preserved via `/app`
- BackToWebsiteButton positioned bottom-20 on mobile (above bottom nav), bottom-4 on desktop
