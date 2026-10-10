# Deck Binder setup

Deck Binder runs on GitHub Pages and keeps your decks and cards in Firebase,
so everyone in the family sees the same binder on every device. It works the
same way as the Halfway Point app.

## 1. Create a Firebase project (free, about 5 minutes)

A separate project keeps Deck Binder's rules apart from the trip app's.

1. Go to https://console.firebase.google.com and click **Create a project**.
   Name it something like "deck-binder". Google Analytics isn't needed.
2. Open **Build → Firestore Database → Create database**. Pick a location
   near you (us-central is fine) and start in **production mode**.
3. Open the **Rules** tab. Select everything, delete it, and paste in the
   whole `firestore.rules` file. Replace `change-me` with your family code
   **in lowercase** (for example `pikachu-crew-42`) and click **Publish**.
4. Click the gear next to Project Overview, then **Project settings**. Under
   **Your apps**, click the web icon (`</>`), give it a nickname, and register
   it. Hosting isn't needed.
5. Copy the values from the `firebaseConfig` block it shows into
   `firebase-config.js`.

The project stays on the free Spark plan. No card is needed.

**Using the trip app's project instead?** Don't replace its rules. Open its
Rules tab and paste the `familyCode()` line and the
`match /deckbinder/{code}/{document=**}` block from `firestore.rules` inside
the existing `match /databases/{database}/documents { ... }` section, next to
the trip app's rules. If both apps use a function named `familyCode()`, rename
this one (for example `deckCode()`) in both places. Use that project's config
in `firebase-config.js`.

## 2. Put it on GitHub Pages

1. Create a new repository on GitHub (for example `deck-binder`). Public is
   fine; nothing secret is in these files.
2. Upload `index.html`, `firebase-config.js`, `firestore.rules`, `SETUP.md`,
   `CHANGELOG.md` and `APP-GUIDELINES.md`.
3. Open **Settings → Pages**. Under **Branch**, choose `main` and `/ (root)`,
   then **Save**. After a minute your site is at
   `https://YOUR-NAME.github.io/deck-binder/`.

## 3. First visit on each device

1. Open the site and enter the family code.
2. Tap **Settings** and paste your Claude API key, which turns on the deck
   coach. Create the key at https://console.anthropic.com (API Keys). It's
   saved only on that device. While you're there, set a monthly spend limit
   under **Limits**; a typical coaching question costs a few cents or less.
3. Optional: add a free card database key from https://dev.pokemontcg.io in
   Settings. It raises the lookup limit from 1,000 to 20,000 a day.

## Why the family code matters

Your Firebase config is public on GitHub Pages; that's normal for Firebase.
The family code in the rules is what keeps your binder private, so choose
something not easy to guess and only share it with family.

## Updating the app later

Upload the new `index.html` to GitHub and check that the version number at
the bottom of the page changed. If a changelog entry says **Needs updated
Firebase rules**, repeat step 1.3 with the new `firestore.rules`.
