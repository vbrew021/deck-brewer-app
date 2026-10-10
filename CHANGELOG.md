# Changelog

## 1.3.1 (October 10, 2026)
- Fixed: "The coach's answer came back garbled." The coach now uses light
  thinking and a much larger answer limit, so long answers don't get cut off.
- If an answer is still cut off, the coach shows what it wrote and suggests
  asking "keep going"; if it can't read the answer at all, it retries once
  asking for a shorter reply.

## 1.3.0 (October 10, 2026)
- Fixed: coach messages no longer overlap or jump around while scrolling.
- Fixed: the stray "Opening your decks…" text below the page is gone.
- Added: each deck's coach chat is saved and shared, so you can come back and
  continue it. New chat clears it.
- Added: Copy deck, to make another version of a deck (suggests "v2", "v3").
- Added: Scorching Charcoal (Pokémon TCG Classic, CLC 26) as a built-in extra
  card, plus "Add a missing card" in Find cards for others the database lacks.
- Added: Casual format, which skips tournament legality checks.
- Coach replies now show bold text and bullet lists properly.
- No Firebase changes needed (new data lives under the existing rules).

## 1.2.0 (October 10, 2026)
- Changed: card data and images now come from TCGdex, a free, open-source
  card database, because the Pokémon TCG API (pokemontcg.io) is shutting down.
- Added: cards saved before this version are updated to TCGdex automatically
  the first time the app opens, keeping your counts.
- Removed: the card database key setting (TCGdex doesn't need one).
- No Firebase changes needed.

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
