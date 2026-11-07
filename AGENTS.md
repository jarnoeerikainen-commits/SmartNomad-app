# Architecture rules

- Keep mobile entry and Concierge presentation separate from AI/search/payment logic so usability changes cannot change booking behavior.
- Automatic location refresh may use GPS only with existing permission; explicit refresh may request it, so startup does not trigger consent dialogs.