import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
const firebaseConfig = {
    apiKey: "AIzaSyCG0QlTFqc3UNU2EnbO5YJGaW5AHt8WZBk",
    authDomain: "abnaa-shiba.firebaseapp.com",
    databaseURL: "https://abnaa-shiba-default-rtdb.firebaseio.com",
    projectId: "abnaa-shiba",
    storageBucket: "abnaa-shiba.appspot.com",
    messagingSenderId: "735720885767",
    appId: "1:735720885767:web:0ee2edd27943e2e1dea4a2",
    measurementId: "G-BL58SWW6QX"
};
const app = firebase.initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
