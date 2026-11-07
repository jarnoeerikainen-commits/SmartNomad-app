# Mobile homepage and Demo APP entry

1. Show the existing public homepage when visitors open SuperNomad on phones; stop the automatic jump into the app.
2. Label the homepage app-entry buttons “Demo APP” and send them directly to Concierge, without signup or an introduction.
3. Preserve cookie choices, direct app access, navigation, voice, travel searches, and payment safeguards.
4. Test entry rules, run the app regression suite, and check fresh/repeat visits and the button-to-Concierge flow at several phone sizes and desktop.

## Technical scope

Keep this change in entry routing, existing homepage links, and initial app presentation. Use an explicit Concierge entry query; leave AI and booking logic untouched.