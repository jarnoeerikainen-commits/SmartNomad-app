# Public claims and sensitive-feature cleanup

## Goal

Make the public SuperNomad website evidence-safe and investor-ready without removing working capabilities from the signed-in app.

## Changes

1. **Remove unsupported public claims**
   - Delete the static live ticker, online-user count, ETIAS-live wording, incident counts, city alerts, latency figures, and other unsourced market/product statistics.
   - Keep only factual product descriptions, established legal thresholds, and configured prices; soften any absolute or real-time claims that are not backed by a displayed source.

2. **Separate current product from future roadmap**
   - Remove Guardian/SOS, autonomous booking, and Agentic Wallet from public capability, pricing, safety, and demo copy.
   - Preserve those modules inside the app, but do not market them publicly as available services.
   - Describe Concierge booking accurately as user-approved search and simulated checkout where relevant.

3. **Make Back Office private**
   - Remove every visible Back Office link from the website, app sidebar, and shared navigation controls.
   - Keep `/admin` available only to authenticated staff roles; remove anonymous synthetic-admin access.
   - Preserve admin tools and staff workflows for authorized users.

4. **Regression protection**
   - Add tests for public-copy exclusions and staff-route authorization.
   - Search built source for banned claims and public admin links.
   - Run the full test suite and lint checks, fix regressions, then verify desktop and mobile website/app flows in the browser.

## Acceptance checks

- No public page shows “6.2M nomads online,” a live ticker, ETIAS-live text, incident statistics, Guardian/SOS, Agentic Wallet, autonomous-booking claims, or a Back Office link.
- Direct anonymous access to `/admin` returns to the public website.
- The main app, Concierge, booking demo, navigation, and authorized staff route continue to work.
- Automated tests pass and browser checks show no runtime or layout errors.