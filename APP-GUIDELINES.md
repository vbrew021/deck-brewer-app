# Deck Brews: guidelines for future changes

Attach this file with the current `index.html` (and `firestore.rules` if
Firebase might change) when starting a new chat about the app, and ask Claude
to follow it.

## What the app is

A Pokémon TCG deck builder for a parent and son. They build 60-card decks
from cards they own, often starting from lists on limitlesstcg.com, and use
an AI coach to find substitutes and understand the deck.

## How it's hosted

- `index.html` on GitHub Pages; one file with inline CSS and JavaScript
  (Preact + htm from unpkg, Firebase 12.19.0 from gstatic). No build step.
- `firebase-config.js` holds the Firebase config, the public reCAPTCHA v3
  site key, and the Gemini model name. index.html imports it with
  `import * as cfg` so older config files without newer lines still load.
- Shared data in Firestore under `deckbrewer/{familyCode}/` (the app's
  original name, Deck Brewer; never rename this path or existing data is lost). The code is
  entered on the first visit, lowercased, and checked by `firestore.rules`.
- Saved card data: `.github/workflows/update-cards.yml` runs
  `scripts/build-cards.mjs` weekly (and on demand) to write `data/cards.json`:
  `{ version, updated, series, setCodes, sets, cards }`, where each card is in
  TCGdex's shape with `set` as an id (`sets` holds names and dates) and empty
  fields dropped. The script reads set ids and codes from TCGdex's
  cards-database repo, downloads the Scarlet & Violet and Mega Evolution eras
  (plus older eras if `INCLUDE_EXPANDED=true`), and refuses to overwrite the
  file if far fewer cards come back. The app loads it once (`localReady`,
  `LOCAL`), merges its `setCodes`, and uses it first in `resolveLines()`,
  `findByName()` and `searchCards()`; TCGdex live is the fallback for cards
  not included. The app must keep working when the file is missing.
- Card data and images come from TCGdex's free GraphQL API
  (`https://api.tcgdex.net/v2/graphql`), called from the browser; no key.
  `slimCard()` converts TCGdex cards to the app's card shape. Card images
  are the TCGdex image URL plus `/low.webp` or `/high.webp`.
- `SET_CODES` maps Pokémon TCG Live / Limitless set codes (TWM, SVI, MEG...)
  to TCGdex set ids. It was built from TCGdex's open data (the
  `abbreviations.official` field in its cards-database repo). When a new set
  comes out, add its code; until then, lines from that set fall back to a
  name search that picks the newest printing.
- Cards saved before 1.2.0 (pokemontcg.io images) are upgraded once on load
  by `upgradeLegacyCards()`.
- Extra cards: `BUILT_IN_EXTRAS` holds cards TCGdex lacks (e.g. Scorching
  Charcoal, CLC 26, a non-tournament Pokémon TCG Classic card). Family-added
  cards from the "Add a missing card" form are stored in Firestore
  `customCards`. Both are searched and matched on import before TCGdex.
- Formats: Standard, Expanded, and Casual (no legality checks).
- Scan cards: `ScanCards` resizes the photo (`photoToJpeg`), sends it to the
  coach's Gemini model with a response schema (`scanCardPhoto`), resolves the
  results with `resolveLines()`, and shows a review list before anything is
  added. It's hidden unless the coach is set up.
- Versions: `findVersions()` lists every printing of a card name (saved card
  data, extra cards, then TCGdex live; falls back to "name contains" when
  nothing matches exactly). `VersionPicker` is used by scan review rows and by
  the card details window, where `switchVersion()` moves deck and library
  copies to the chosen printing.
- Shared-card warnings: `deckUsage()` / `sharedConflicts()` total copies across
  all decks per card (reprints count together, basic Energy skipped) and
  compare with the Card Library.
- Test draw: `DrawTester` simulates hands (mulligan until a Basic) and shows
  exact hypergeometric odds (`atLeastOne()`).
- Home-screen install: `manifest.webmanifest` and `icons/` (navy background,
  three fanned cards in the section colors). No service worker on purpose, so
  the app never shows a stale cached version.
- Tabs: Deck, Find cards, Card Library (the family's collection; data still
  lives in the Firestore `collection` path; has "My cards" and "Set
  checklists" views), and Want list.
- Want list: `buildWantList()` totals what the chosen decks need per card
  (reprints together, basic Energy skipped; "all at once" sums decks, "one at
  a time" takes the biggest), subtracts the Card Library, and adds the
  family's own wants. Prices come from `fetchPrices()` a few at a time
  (`mapLimit()`), using the cheapest version's market price.
- Set checklists: `SetChecklist` lists a set's cards from the saved card data
  (TCGdex live as a fallback) with +/− buttons that change this exact print's
  library count.
- Compare: `DeckCompare` lines up two decks by card (reprints together) and
  shows the differences.
- Advanced search: `blankFilters()` defines the filter fields, `CardFilters`
  is the shared panel, `matchesFilters()` applies every filter locally (all of
  Card Library; the rest of Find cards), and `searchCards()` sends what TCGdex
  can filter (name, category, types, stage, trainerType, energyType, set via
  id prefix, regulationMark, rarity, illustrator), fetching up to 1,000 cards.
  HP range, card text, special label and format are applied locally.
- Prices: `fetchPrices()` reads TCGplayer pricing from the TCGdex REST card
  endpoint when a card's details open; `tcgplayerUrl()` links to TCGplayer
  (extra cards can carry their own `tcgplayerUrl`).
- The deck coach uses Gemini through Firebase AI Logic (Gemini Developer API,
  free tier, Spark plan) with App Check using the reCAPTCHA v3 provider.
  Use Flash-Lite models: in late 2026 the free tier gives them about 500
  requests a day versus about 20 for standard Flash. `COACH_MODELS` lists
  fallbacks used when a model is out of daily quota or retired.
  Everything must stay free: no billing account, no paid API keys.
- The coach suggests both cards in the collection and cards not in the app
  yet (the app collection may be incomplete); suggestions can carry a
  `group` heading, and "We have it" adds a suggested card to the collection.
- Copy for Claude builds a prompt (`claudePrompt()`) for the user to paste
  into claude.ai; Claude's decklist comes back in through Import list.

## Conventions

1. **Semantic versioning.** Update `VERSION` in `index.html` and add a
   `CHANGELOG.md` entry with every release.
2. **Flag rule changes.** Any change to Firestore paths adds "Needs updated
   Firebase rules" to the changelog and a reminder to the user.
3. **Shared data lives in Firestore.** localStorage is only for per-device
   settings (family code, format, active deck) and for
   "this device only" mode when `firebase-config.js` isn't filled in.
4. **Firestore-safe values.** Never write `undefined`; `slimCard()` turns
   missing fields into null, empty strings or empty arrays.
5. **Decklist format.** Import and export use the Limitless / Pokémon TCG
   Live text format (`4 Dreepy TWM 128` under Pokémon/Trainer/Energy headers).
6. **Ownership.** Reprints count as owned: same name for Trainers and Energy;
   same name and attack names for Pokémon (`ownedCount()`).
7. **Coach chat UI.** Coach messages use the `msg-user` / `msg-coach`
   classes; never reuse the panel's `assistant` class on messages (that caused
   overlapping sticky messages in 1.2.0). Replies render via `richText()`.
8. **Web search.** With "Search the web" on (per-device setting, default on)
   or when a question mentions Limitless, tournaments, or a link, the coach
   uses a model variant with the `googleSearch` and `urlContext` tools. That
   variant has no response schema (it relies on the JSON instructions and the
   tolerant parser). Google requires displaying `searchEntryPoint`
   (rendered in a shadow DOM by `SearchSuggestions`) and the sources from
   `groundingChunks` for any grounded answer; never remove those. If the web
   variant fails, `callCoach()` retries without tools and the answer notes it.
9. **Coach memory.** Each question sends: coach notes, other decks
   (`describeDecks()`), format, current deck, collection, and the last 12
   chat messages. Past coach answers are sent with a bracketed list of what
   happened to each suggestion (`suggestionOutcomes()`: added, removed,
   passed, no action yet) so the coach doesn't repeat itself. The coach may
   return `remember` (a proposed note); it's only saved after the family
   taps "Save to coach notes". Bold card names in a reply that aren't in
   `suggestions` get pictures via `findMentionedCards()` (action `show`).
10. **Coach output.** The coach answers as JSON (reply plus suggestions) using
   a response schema, so suggestions can be shown as cards with an Add or
   Remove button. It prefers owned cards and must not invent cards. Coach
   errors map to plain messages in `friendlyCoachError()`.
11. **Kid-friendly copy.** Plain words, sentence case, errors that say what to
   do next.
12. **Design.** Cool page background, navy binder sheets for deck sections
   with section colors (Pokémon purple, Trainers blue, Energy gold), Bricolage
   Grotesque headings and Lexend body text, visible focus outlines, works on
   phones.
   Light and dark themes: every color is a CSS variable on `:root`, with dark
   values under `@media (prefers-color-scheme: dark)` (guarded by
   `:root:not([data-theme="light"])`) and repeated under
   `:root[data-theme="dark"]`. Never hard-code a light color; add a variable to
   both themes instead. The theme choice (`db.theme`: system, light, dark) is
   per device and applied by a small script in `<head>` to avoid a white flash.
13. **Update everywhere.** Each release updates `index.html`, `CHANGELOG.md`,
    and `SETUP.md` when instructions change. Remind the user to upload to
    GitHub and check the version label.

## Shared data (Firestore, under deckbrewer/{code}/)

- `decks/{deckId}`: `{ id, name, entries: [{ card, count }], createdAt, updatedAt }`
  Whole-deck writes; if two people edit the same deck at the same moment,
  the last save wins.
- `collection/{cardId}`: `{ card, count }`, one document per printing.
- `chats/{deckId}`: `{ messages, updatedAt }`, the coach chat saved with each
  deck (last 40 messages). Deleted with its deck; not copied by Copy deck.
- `customCards/{id}`: family-added extra cards (ids start with `custom-`).
- `wants/{cardId}`: `{ card, count }`, cards the family added to the want list
  by hand (deck needs are calculated, not stored).
- `settings/coach`: `{ notes, updatedAt }`, the shared coach notes (up to
  1,500 characters), sent with every coach question.
