// 1. Paste the config from Firebase: Project settings → General → Your apps → Web app.
//    Until this is filled in, Deck Brewer runs in "this device only" mode.
export const firebaseConfig = {
  apiKey: "AIzaSyCxaKzUl5fhH9XLekfvE4jKCkeBUoQoDro",
  authDomain: "deck-brewer-app.firebaseapp.com",
  projectId: "deck-brewer-app",
  storageBucket: "deck-brewer-app.firebasestorage.app",
  messagingSenderId: "197687537830",
  appId: "1:197687537830:web:fb7b46da58b9c9b65b8467"
};

// 2. For the built-in deck coach: your reCAPTCHA v3 *site key* (the public one).
//    See step 2 in SETUP.md. Never put the secret key here.
export const recaptchaSiteKey = "6LdwvegtAAAAABBlCUt6Y5o6xx1-PwlNu-kOMCwa";

// 3. Which Gemini model the coach uses. Change this if Google retires it.
export const geminiModel = "gemini-3.5-flash-lite";
