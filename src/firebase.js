// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCAEvsaqOBtIBwCv7VhwoaYWw8y3pnq83M",
    authDomain: "milk-meets-honey.firebaseapp.com",
    projectId: "milk-meets-honey",
    storageBucket: "milk-meets-honey.appspot.com",
    messagingSenderId: "152322396991",
    appId: "1:152322396991:web:bae3dd50a47054aee3398a",
    measurementId: "G-Q96R76PZVX"
};

// Initialize Firebase
initializeApp(firebaseConfig);
const auth = getAuth();

export { auth }