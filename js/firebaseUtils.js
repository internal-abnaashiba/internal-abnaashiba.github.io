import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { getStorage } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js";
import { getAuth, onAuthStateChanged, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

let count = 0;

export const firebaseConfig = {
    apiKey: "AIzaSyCG0QlTFqc3UNU2EnbO5YJGaW5AHt8WZBk",
    authDomain: "abnaa-shiba.firebaseapp.com",
    databaseURL: "https://abnaa-shiba-default-rtdb.firebaseio.com",
    projectId: "abnaa-shiba",
    storageBucket: "abnaa-shiba.appspot.com",
    messagingSenderId: "735720885767",
    appId: "1:735720885767:web:3d6ad60fb313f20bdea4a2",
    measurementId: "G-5M2BNQBBGG"
};
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export function endLoading() {
    if (count == 0) {
        count = 1;
    }
    else {
        count = 0;
        document.getElementById('loading').style.display = 'none';
        document.getElementById('body').style.display = 'block';
    }
}
export function startLoading() {
    count = 1;
    document.getElementById('loading').style.display = 'block';
    document.getElementById('body').style.display = 'none';
}