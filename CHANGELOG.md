# Changelog

## 1.12.1 (October 10, 2026)
- Fixed: the coach sometimes said it had "used up today's free requests" when
  the real problem was something else (for example Firebase blocking the
  request, or a model name Google didn't recognize). The check matched the
  word "rate", which is inside "generateContent" in every Gemini error.
- Coach errors now show the real reason, with a Details section (and Copy
  details) showing Google's original message.
- Added: "Try every model again" in Settings, for models the app set aside
  for the day.
- No Firebase changes needed.

## 1.12.0 (October 10, 2026)
- Added: Magic: The Gathering. A Pokémon | Magic switch in the header gives
  each game its own decks, Card Library, want list, coach notes and format.
- Magic card search, pictures, legality and prices come from Scryfall (free,
  no key). Find cards and Card Library have Magic filters: card text, type,
  subtype, colors (including, exactly, at most), mana value, set, rarity,
  artist, format legality, sorting, and every printing.
- Magic decks: Creatures, Planeswalkers, Battles, Instants, Sorceries,
  Artifacts, Enchantments and Lands sections, a sideboard (up to 15), a mana
  curve, and checks for 60+ cards, 4 copies across main and sideboard (basic
  lands exempt) and Standard, Pioneer or Modern legality (banned cards
  flagged). Basic lands aren't counted as cards you're missing.
- Decklist import and Copy list for MTG Arena, MTGO, Moxfield and MTGGoldfish
  formats, including sideboards and double-faced cards.
- Card details show mana symbols, type line, rules text, power/toughness or
  loyalty, legality in each format, and prices, with Other versions.
- The coach has Magic instructions (Modern, Pioneer, Standard, Casual; not
  Commander), looks up lists on MTGGoldfish, MTGTop8 and Moxfield when needed,
  and can add suggestions straight to the sideboard.
- Card Library backups now save and restore one game at a time.
- Still Pokémon-only for now: Test draw, Checkup, Matchups, Image & print,
  Scan cards and Set checklists (Magic versions are coming next).
- No Firebase changes needed.

## 1.11.3 (October 10, 2026)
- Changed: renamed the app to TCG Deck Brewer ("Deck Brewer" under the
  home-screen icon). Saved data stays under the `deckbrewer` path.
- No Firebase changes needed.

## 1.11.2 (October 10, 2026)
- Changed: the "Search the web" checkbox is now a Web search setting: When
  needed (new default), Always, or Off. With When needed, the coach answers
  from its own knowledge and, if a question needs current information, the
  app automatically asks again with web search. Questions that mention
  Limitless, tournaments, top decks or a link search right away.
- This saves free requests and web searches for when they're useful.
- No Firebase changes needed.

## 1.11.1 (October 10, 2026)
- Fixed: web-search questions used up extra requests. Google's free tier only
  includes Google Search on its 2.5 models, so web questions now go to
  gemini-2.5-flash-lite (then gemini-2.5-flash) and fall back to answering
  without search if those are used up.
- Added: gemini-2.5-flash-lite as another fallback coach model (free limits
  are per model, so this adds more free requests per day).
- The app now remembers which models are used up for the day and skips them,
  instead of retrying them on every question.
- Settings shows how many coach and scan requests this device made today and
  which models are used up. The "used up" message lists Google's limits.
- No Firebase changes needed.

## 1.11.0 (October 10, 2026)
- Added: Checkup on the Deck tab. Instant checks for deck size, Basic Pokémon
  and mulligan odds, evolution lines, Energy types, Supporters, draw and
  search cards, and switching, explained simply, plus a button that asks the
  coach for a full review.
- Added: Matchups on the Deck tab. Ask the coach how the deck does against
  today's top decks on Limitless, a deck you name, or one of your own decks.
- Added: Image & print on the Deck tab. Makes a Limitless-style deck image to
  download or share, and opens a printable tournament-style decklist.
- No Firebase changes needed.

## 1.10.0 (October 10, 2026)
- Added: Want list tab. It lists every card your chosen decks need that isn't
  in your Card Library (build all at once, or one at a time), plus cards you
  add yourself from a card's details or the coach's "Want it" link. Shows
  TCGplayer market prices and an estimated total, "Copy for TCGplayer" for
  Mass Entry, and "Got it" to move cards into your library.
- Added: Set checklists in Card Library. Pick a set to see every card in
  number order, tap + or − to record what you have, and track your progress.
- Added: Compare on the Deck tab, showing which cards differ between two decks.
- Fixed: checkboxes next to search boxes no longer stretch away from their labels.
- No Firebase changes needed (the want list lives under the existing rules).

## 1.9.1 (October 10, 2026)
- Added: "Wrong version? Pick another" on scanned cards, showing every
  printing of the card (newest first) to choose from. Cards the scan couldn't
  match get "Find this card", where you can type the right name.
- Added: "Other versions" in each card's details. Picking a different printing
  moves this deck's copies and your Card Library's copies to it (after
  asking).
- No Firebase changes needed.

## 1.9.0 (October 10, 2026)
- Added: Scan cards (Card Library). Take a photo of a card or a binder page;
  the coach's Gemini model reads the cards, matches them, and lets you check
  them over before adding them to your library. Needs the coach set up.
- Added: shared-card warnings on the Deck tab, listing cards this deck and
  other decks both use when your library doesn't have enough copies for all.
- Added: Test draw on the Deck tab. Draw opening hands (with mulligans),
  draw more cards, see the 6 prize cards, and get the odds of a Basic in your
  first 7 and of drawing any card by your first or second turn.
- Added: install Deck Brews on your home screen with its own icon
  (SETUP.md, step 6). Upload `manifest.webmanifest` and the `icons` folder.
- No Firebase changes needed.

## 1.8.1 (October 10, 2026)
- Changed: renamed the app from Deck Brewer to Deck Brews.
- The Firestore data path stays `deckbrewer`, so all saved decks, cards,
  chats and notes stay connected. No Firebase changes needed.

## 1.8.0 (October 10, 2026)
- Added: weekly saved card data. A GitHub Action (`update-cards.yml`) runs
  `scripts/build-cards.mjs` every Monday to save every Standard card from
  TCGdex into `data/cards.json`. The app searches and imports from this copy
  first, so it's faster and keeps working if TCGdex is down; it asks TCGdex
  live only for older cards. New set codes arrive with the data, so new sets
  work without an app update.
- Settings shows how many cards are saved and when they were updated.
- Needs one-time setup: SETUP.md, step 5 (adds two files on GitHub). Until
  then, the app works as before.

## 1.7.0 (October 10, 2026)
- Added: dark mode. It follows your device's setting by default; the moon/sun
  button in the header switches between light and dark, and Settings has a
  Theme option (Match this device, Light, Dark), saved per device.
- No Firebase changes needed.

## 1.6.0 (October 10, 2026)
- Changed: "Our cards" is now "Card Library".
- Added: advanced search in Find cards and Card Library, modeled on
  Limitless's card search: card text, Pokémon/Energy type, stage, special
  label (ex, Mega, V, Radiant, ACE SPEC, no rule box), Trainer kind, Energy
  kind, HP range, set code, regulation mark, rarity, artist, format, and
  sorting. Filters are remembered, and Find cards re-runs your last search
  when you come back to the tab.
- Added: TCGplayer low, mid, high and market prices in each card's details
  (from TCGdex), with a "See it on TCGplayer" link.
- No Firebase changes needed.

## 1.5.0 (October 10, 2026)
- Added: "Search the web" (on by default) lets the coach look up current
  decklists on Limitless and other sites with Google Search, and read pages
  you paste a link to. Answers that used search show their sources and
  Google's search suggestions, as Google requires. If web search isn't
  available, the coach answers anyway and says so.
- Changed: the coach now suggests a mix of cards from your collection and
  good cards you don't have in the app yet, including full evolution lines,
  grouped under headings like "From your collection" and "Worth picking up".
- Added: "We have it" on suggestions for cards in your physical collection
  that aren't in the app yet; it adds them to Our cards.
- No Firebase changes needed.

## 1.4.0 (October 10, 2026)
- Added: coach notes in Settings, shared lasting preferences the coach follows
  for every deck. When you mention a preference in chat, the coach offers to
  remember it, and nothing is saved until you tap "Save to coach notes".
- Added: the coach sees your other decks' names and main Pokémon.
- Added: "No thanks" on coach suggestions. The coach is told which
  suggestions you added or passed on, so it stops repeating them.
- Fixed: card pictures with suggestions. The coach is told firmly to list
  every recommended card, and any card it names in bold without listing
  still gets a picture and an "Add 1 to deck" button.
- Copy for Claude includes the coach notes and other decks too.
- No Firebase changes needed.

## 1.3.2 (October 10, 2026)
- Changed: the coach now uses Gemini 3.5 Flash-Lite by default. Google's free
  tier gives Flash-Lite about 500 requests a day, versus about 20 for
  standard Flash models.
- Added: if the coach's model runs out of free requests or is retired, it
  switches to another Flash-Lite model automatically.
- The "used up" message now says whether to wait a minute or until tomorrow.
- Needs updated firebase-config.js: change the geminiModel line to
  "gemini-3.5-flash-lite" (or copy your values into the new file).

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
