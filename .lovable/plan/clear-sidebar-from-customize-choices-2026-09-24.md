# Clear Sidebar From Customize Choices

## Goal
Make the sidebar show only features marked Visible in Customize My App, with no empty section headings.

## Changes
1. **Respect visibility everywhere**
   - Stop forcing the secondary menu group to remain visible.
   - Keep only true system navigation permanently available: Home, Customize, Settings, Help, and Upgrade.
   - Hide Snomad ID, Sovereign Access, Travel Inbox, Finance & Payments items, SOS-labelled finance items, and Travel Essentials unless individually enabled.

2. **Complete customization coverage**
   - Add any listed sidebar feature missing from the customization registry, including Snomad ID, so users can explicitly show it again.
   - Keep voice navigation synchronized through the same feature registry.
   - Remove empty sidebar group headings automatically.

3. **Clean defaults and preserve choices**
   - Make the listed features hidden for users who have not chosen them.
   - Preserve existing explicit user visibility choices rather than resetting all preferences.
   - Migrate old saved defaults safely so previously forced menu items do not remain visible by accident.

4. **Verification**
   - Add tests for default-hidden items, explicit re-enabling, persistence, and empty-group removal.
   - Run focused tests and lint checks.
   - Verify desktop and mobile sidebar/customization flows, including reload persistence and voice-discoverability consistency.
