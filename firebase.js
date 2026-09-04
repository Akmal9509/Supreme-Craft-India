// ========================================
// SUPREME CRAFT INDIA
// FIREBASE CONFIGURATION
// ========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


// ========================================
// FIREBASE CONFIG
// ========================================

const firebaseConfig = {

    apiKey: "AIzaSyAc9iuAS9RA1orVpkwdSomkSiS07QLe0Ak",

    authDomain:
        "supreme-craft-india.firebaseapp.com",

    projectId:
        "supreme-craft-india",

    storageBucket:
        "supreme-craft-india.firebasestorage.app",

    messagingSenderId:
        "9064158877",

    appId:
        "1:9064158877:web:fa4319ebc7cf50a2fe2674",

    measurementId:
        "G-RQ9Z44PEX5"

};


// ========================================
// INITIALIZE FIREBASE
// ========================================

const app =
    initializeApp(firebaseConfig);


// ========================================
// FIRESTORE DATABASE
// ========================================

const db =
    getFirestore(app);


// ========================================
// EXPORT
// ========================================

export {
    app,
    db
};