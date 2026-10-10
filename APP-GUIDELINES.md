# Deck Brewer: guidelines for future changes

Attach this file with the current `index.html` (and `firestore.rules` if
Firebase might change) when starting a new chat about the app, and ask Claude
to follow it.

## What the app is

A Pokémon TCG deck builder for a parent and son. They build 60-card decks
from cards they own, often starting from lists on limitlesstcg.com, and use
an AI coach to find substitutes and understand the deck.

## How it's hosted

- `index.html` on GitHub Pages; one file with inline CSS and JavaScript
  (Preact + htm from unpkg, Firebase 10.14.1 from gstatic). No build step.
- Shared data in Firestore under `deckbrewer/{familyCode}/`. The code is
  entered on the first visit, lowercased, and checked by `firestore.rules`.
- Card data comes straight from pokemontcg.io in the browser.
- The coach calls the Claude API from the browser with a key saved on each
  device (Settings). Moving it to a Firebase Cloud Function later only
  changes `askCoach()` and requires the Blaze plan.

## Conventions

1. **Semantic versioning.** Update `VERSION` in `index.html` and add a
   `CHANGELOG.md` entry with every release.
2. **Flag rule changes.** Any change to Firestore paths adds "Needs updated
   Firebase rules" to the changelog and a reminder to the user.
3. **Shared data lives in Firestore.** localStorage is only for per-device
   settings (family code, API keys, model, format, active deck) and for
   "this device only" mode when `firebase-config.js` isn't filled in.
4. **Firestore-safe values.** Never write `undefined`; `slimCard()` turns
   missing fields into null, empty strings or empty arrays.
5. **Decklist format.** Import and export use the Limitless / Pokémon TCG
   Live text format (`4 Dreepy TWM 128` under Pokémon/Trainer/Energy headers).
6. **Ownership.** Reprints count as owned: same name for Trainers and Energy;
   same name and attack names for Pokémon (`ownedCount()`).
7. **Coach output.** The coach always answers through the `deck_advice` tool
   so suggestions can be shown as cards with an Add or Remove button. It
   prefers owned cards and must not invent cards.
8. **Kid-friendly copy.** Plain words, sentence case, errors that say what to
   do next.
9. **Design.** Cool page background, navy binder sheets for deck sections
   with section colors (Pokémon purple, Trainers blue, Energy gold), Bricolage
   Grotesque headings and Lexend body text, visible focus outlines, works on
   phones.
10. **Update everywhere.** Each release updates `index.html`, `CHANGELOG.md`,
    and `SETUP.md` when instructions change. Remind the user to upload to
    GitHub and check the version label.

## Shared data (Firestore, under deckbrewer/{code}/)

- `decks/{deckId}`: `{ id, name, entries: [{ card, count }], createdAt, updatedAt }`
  Whole-deck writes; if two people edit the same deck at the same moment,
  the last save wins.
- `collection/{cardId}`: `{ card, count }`, one document per printing.
