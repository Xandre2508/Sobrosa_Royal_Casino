import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBZXk1befV9zRKifrADxknJtrKedFWnEnI",
    authDomain: "casinoroyalesobrosa.firebaseapp.com",
    projectId: "casinoroyalesobrosa",
    storageBucket: "casinoroyalesobrosa.firebasestorage.app",
    messagingSenderId: "1078874375334",
    appId: "1:1078874375334:web:ac4a2c445655c65245a067",
    measurementId: "G-8SYMPVFSF9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);