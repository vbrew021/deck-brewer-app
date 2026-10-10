# Deck Brewer setup

Deck Brewer runs on GitHub Pages and keeps your decks and cards in Firebase,
so everyone in the family sees the same decks and cards on every device.
Everything here is free: no credit card, no API keys to buy. Card data and
images come from TCGdex (https://tcgdex.dev), a free, open-source card
database that needs no sign-up.

## 1. Create a Firebase project (about 5 minutes)

A new project keeps Deck Brewer's rules separate from anything else you run.

1. Go to https://console.firebase.google.com and click **Create a project**.
   Name it something like "deck-brewer". Google Analytics isn't needed.
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

**Using a Firebase project you already have?** Don't replace its rules, or
your other app will lose access. Open its Rules tab and paste the
`familyCode()` line and the `match /deckbrewer/{code}/{document=**}` block
from `firestore.rules` inside the existing
`match /databases/{database}/documents { ... }` section. If a function named
`familyCode()` is already there, rename this one (for example `deckCode()`)
in both places. Use that project's config in `firebase-config.js`.

## 2. Turn on the deck coach (about 10 minutes)

The built-in coach uses Google's Gemini through Firebase AI Logic, on the
free tier. Firebase also requires App Check, which uses Google's invisible
reCAPTCHA to make sure requests come from your site and not someone else's.
Nobody ever has to solve a puzzle.

**Turn on AI Logic**

1. In the Firebase console, open **AI Services → AI Logic** and click
   **Get started**.
2. When asked for a Gemini API provider, choose **Gemini Developer API**.
   Don't link a billing account; that keeps you on the free tier.
3. Finish the guided steps. App Check is switched on for AI Logic along the
   way.

**Create a reCAPTCHA key**

4. Go to https://www.google.com/recaptcha/admin/create.
   - Label: "Deck Brewer"
   - Type: **Score based (v3)**
   - Domains: `YOUR-NAME.github.io` (your GitHub username; see step 3)
   - If Google asks for a Google Cloud project, pick your Firebase project.
5. Submit. You'll get a **site key** and a **secret key**.

**Connect them**

6. In the Firebase console, open **Security → App Check → Apps**. Click your
   web app, choose **reCAPTCHA**, paste the **secret key**, and save.
7. Paste the **site key** into `recaptchaSiteKey` in `firebase-config.js`.
   (The site key is public and safe on GitHub. Never put the secret key in
   any file.)

Good to know:

- The coach only works from your real site address, not from a copy of
  `index.html` opened on your computer, because reCAPTCHA checks the domain.
- The free tier has daily limits. If the coach says it's used up its free
  requests, try again later or use **Copy for Claude**.
- On the free tier, Google's terms let it use your requests to improve its
  products. Deck lists and card names are all that's sent.
- If Google retires the model, change `geminiModel` in `firebase-config.js`
  to a current one listed on Firebase's AI Logic models page.

## 3. Put it on GitHub Pages

1. Create a new repository on GitHub (for example `deck-brewer`). Public is
   fine; nothing secret is in these files.
2. Upload `index.html`, `firebase-config.js`, `firestore.rules`, `SETUP.md`,
   `CHANGELOG.md` and `APP-GUIDELINES.md`.
3. Open **Settings → Pages**. Under **Branch**, choose `main` and `/ (root)`,
   then **Save**. After a minute your site is at
   `https://YOUR-NAME.github.io/deck-brewer/`.

## 4. First visit on each device

Open the site and enter the family code. That's it; there's nothing else to
set up per device.

## Copy for Claude

Under the coach there's a **Copy for Claude** button. It copies your current
deck, your cards and whatever you've typed into a ready-made prompt. Paste it
into a chat at https://claude.ai (the free plan works). When Claude gives you
a decklist, paste it into **Import list** on the Deck tab, and the badges
show which cards you own. This works even before step 2 is done.

## Why the family code matters

Your Firebase config is public on GitHub Pages; that's normal for Firebase.
The family code in the rules is what keeps your decks and cards private, so
choose something not easy to guess and only share it with family.

## Updating the app later

Upload the new `index.html` to GitHub and check that the version number at
the bottom of the page changed. If a changelog entry says **Needs updated
Firebase rules**, repeat step 1.3 with the new `firestore.rules`. If it says
**Needs updated firebase-config.js**, copy your values into the new file.
