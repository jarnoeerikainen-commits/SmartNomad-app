# Pause Friend and SportBuddy Introductions

## Goal
Globally pause every proactive new-friend and SportBuddy introduction for all users until the product owner deliberately re-enables it.

## Changes
- Add one fail-closed product policy switch that defaults to paused and is not user-overridable.
- Stop all timed match notifications, recommendation pop-ups, automatic social matching calls, and spoken match announcements.
- Remove the AI matching/recommendation view while paused; keep existing user-initiated chats and community groups available.
- Block proactive community AI nudges that introduce people or suggest meetups, while preserving replies requested inside an active chat.
- Add server-side guards so direct calls cannot produce social matches or proactive introductions during the pause.
- Remove claims in profile settings that sports-partner matching is currently available.

## Verification
- Add tests proving the global pause blocks match notifications, social match requests, proactive nudges, and voice output.
- Run focused tests and lint checks.
- Verify the app in a browser for generic, John, and Meghan demo users; confirm no recommendation window or voice prompt appears.
- Check the latest preview build and runtime diagnostics, then fix any failures found.

## Technical details
The policy will be shared by all relevant frontend paths. Edge functions will independently fail closed, preventing bypasses from stale clients. Existing direct messaging remains manual; only introductions, matching, recommendations, meetup nudges, and related voice are paused.
