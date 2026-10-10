# Changelog

## 1.1.0 (October 10, 2026)
- Changed: the deck coach now uses Google Gemini through Firebase AI Logic on
  the free tier, so there's no API key to buy or paste on each device.
- Added: Copy for Claude, which copies the deck, your cards and your question
  into a prompt to paste into Claude. Paste Claude's decklist into Import list.
- Removed: the Claude API key and model settings.
- Updated to Firebase 12.19.0, with App Check (invisible reCAPTCHA) for the coach.
- Needs updated firebase-config.js (new recaptchaSiteKey and geminiModel
  lines) and the AI Logic and App Check setup in SETUP.md, step 2.

## 1.0.1 (October 10, 2026)
- Changed: renamed the app from Deck Binder to Deck Brewer.
- Changed: shared data now lives under `deckbrewer/` in Firestore.
- Needs updated Firebase rules (new data path).

## 1.0.0 (October 10, 2026)
- First GitHub Pages release, rebuilt from the Next.js version.
- Added: decks and the card collection are shared through Firebase, using a
  family code, and update live on every device.
- Added: Settings for the Claude API key, model, and an optional card database
  key, all saved per device.
- Deck view with binder sheets, 60-card counter, rule checks and ownership
  badges; Limitless / Pokémon TCG Live list import and copy; card search;
  Our cards with list import and backups; Deck coach with one-tap suggestions.
- Needs Firebase rules (first setup).
