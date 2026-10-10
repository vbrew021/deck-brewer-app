// 1. Paste the config from Firebase: Project settings → General → Your apps → Web app.
//    Until this is filled in, Deck Brewer runs in "this device only" mode.
export const firebaseConfig = {
  apiKey: "PASTE-YOUR-API-KEY",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

// 2. For the built-in deck coach: your reCAPTCHA v3 *site key* (the public one).
//    See step 2 in SETUP.md. Never put the secret key here.
export const recaptchaSiteKey = "PASTE-YOUR-RECAPTCHA-SITE-KEY";

// 3. Which Gemini model the coach uses. Change this if Google retires it.
export const geminiModel = "gemini-3.8-flash";
