/*
  Copy this file to `firebase-config.js` and fill values from your Firebase project settings.
  Then include `firebase-config.js` before `firebase-client.js` in your HTML pages.

  Example usage (in <head> or before firebase-client.js):
  <script src="firebase-config.js"></script>
  <script src="firebase-client.js"></script>

  Replace the properties with the ones from your Firebase console (Project settings -> General).
*/

window.FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};
