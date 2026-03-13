// firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyB5fFRexXa-lEinkAUjAkhwuz33u0r6F2Y",
  authDomain: "doneah-mahli.firebaseapp.com",
  projectId: "doneah-mahli",
  storageBucket: "doneah-mahli.firebasestorage.app",
  messagingSenderId: "47025926349",
  appId: "1:47025926349:web:1f85b7217291d0bf29b984",
  measurementId: "G-9S4G5R6PDW"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
