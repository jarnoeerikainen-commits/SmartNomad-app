# Easier mobile entry and Concierge

## Goal
Open SuperNomad on a phone and reach a ready-to-use Concierge after one cookie choice. Keep other app features, desktop presentation, AI answers, search, payments, and saved customization unchanged.

## Proposed changes

### 1. Concierge is the first phone screen
- Phone visitors opening the main address enter the app directly, without the website’s “Launch SuperNomad” step. Keep the public website accessible through an explicit website view; desktop visitors retain the existing website.
- Open the existing Concierge conversation immediately rather than starting it minimized or showing a list of four assistants first.
- Keep Home, tracking, other advisors, profile, and customized sections reachable. Returning to Concierge remains a single clear tap, including through existing voice navigation.
- Do not reopen the conversation over another section after the user deliberately minimizes it or navigates away.

### 2. Only a cookie choice at startup
- Remove automatic welcome/onboarding, avatar introduction, and permission-tour screens from app entry. Keep tours available only when deliberately requested.
- Show cookie choices immediately, not after onboarding. Retain Accept All, Reject All, and Save Preferences; remember the choice for later visits.
- Do not assume acceptance, silently enable analytics, or overwrite existing consent.
- Do not request microphone, precise location, notifications, contacts, or calendar access on launch. Ask only when the user chooses the relevant feature; existing granted permissions continue to work.
- Do not fabricate an adult age or erase existing age restrictions. Any required age check is deferred to the restricted action, not imposed before basic Concierge testing.
- No automatic spoken introduction or microphone-help pop-up. Voice remains available after the user taps its control.

### 3. Consistent phone experience
- Keep the conversation full-width, with a compact header and readable messages.
- Keep typing, microphone, and send controls within reach above the on-screen keyboard.
- Respect camera notches, home indicators, browser toolbars, rotation, and safe areas; prevent clipping, horizontal scrolling, and overlaps.
- Use touch-friendly controls and avoid input-focus zoom. Preserve the current brand and desktop layout.
- Aim for the same structure and interactions across phones, adapting spacing to screen size rather than stretching everything identically.

## What will not change
- Concierge models, response protocol, travel-search logic, suppliers, prices, booking approval, simulated payments, or security controls.
- Home widgets, sidebar visibility choices, existing saved trips, public claims, staff access, and unrelated features.
- No real booking or money movement is introduced.

## Technical scope
- Limit changes to entry routing, startup presentation, cookie-banner timing, mobile Concierge/nav layout, and startup-only permission prompting where needed.
- Reuse the existing Concierge instead of creating a second chat experience. Preserve the embedded and desktop variants.
- Use the visual viewport with a safe fallback for keyboard-aware sizing and clean up resize/scroll listeners.
- Add focused behavior tests for phone startup, desktop preservation, explicit dismissal/navigation, cookie persistence, no automatic permission requests, and preservation of age restrictions.

## Verification before completion
- Run the existing automated suite and the new focused tests; fix regressions caused by these changes.
- Test a clean first visit with no prefilled onboarding flags: choose cookies, send a real question, confirm a visible reply, and perform a real flight-search conversation.
- Check repeat visits, rejecting optional cookies, opening Home and the sidebar, returning to Concierge, and saved customization.
- Check small and large phone widths, iPhone/Android-style sizes, portrait/landscape, short keyboard-visible viewports, and desktop. Inspect screenshots and runtime/build errors.
- Verify microphone control, permission-denied handling, and speech controls as supported by the browser. Headless tests cannot certify a real microphone, physical keyboard, or every handset; report those limits rather than promise universal perfection.

## Approval boundary
This proposal is shown before application code changes. Implementation starts after approval.