# Simplify Home Screen Customization

## Goal
Make the Home screen open with the user’s current pinned choices already displayed, while keeping manual show/hide and pin controls. Remove the Business, Nomad, Family, Sport, and Sabbatical mode system completely.

## Changes
1. **Persistent automatic Home layout**
   - Keep each user’s visible, hidden, and pinned selections in their existing saved preferences.
   - Ensure pinned items are also visible and appear on Home immediately on every app opening.
   - Unpin an item automatically if the user hides it, preventing contradictory “hidden but pinned” states.
   - Preserve existing choices during upgrades and add new features safely without resetting the user’s layout.

2. **Clearer customization screen**
   - Clarify that “Visible” controls availability and “Pinned” controls Home placement.
   - Keep category, search, hidden-only, reset, and manual controls.
   - Make counts reflect customizable features accurately.
   - Use accessible labels for visibility and pin controls.

3. **Remove lifestyle modes**
   - Remove the Home mode selector and Business-only Home behavior.
   - Remove mode presets, saved-mode handling, and demo-persona mode synchronization.
   - Keep business, family, sport, tax, visa, and other actual features; only the mode-switching layer is removed.

4. **Verification**
   - Add focused tests for persistence, pin/visibility consistency, reset behavior, and new-feature preference merging.
   - Run the relevant test suite and lint checks.
   - Verify desktop and mobile Home/customization flows: pin, reload, display on Home, hide, reload, and reset.
   - Fix any errors found and repeat verification.

## Result
Home becomes a single personal dashboard driven only by the user’s pinned choices, without competing modes or automatic preset changes.
