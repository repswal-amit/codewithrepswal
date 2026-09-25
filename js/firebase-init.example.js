// Rename this file to firebase-init.js and add your own Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase App
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Initialize services
const auth = firebase.auth();
const db = firebase.firestore();
