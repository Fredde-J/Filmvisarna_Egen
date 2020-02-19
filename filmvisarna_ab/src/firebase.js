import firebase from 'firebase'
import 'firebase/firestore'
import store from '@/store/index.js'

// Initialize Firebase
let config = {
    apiKey: "AIzaSyBh_iFDjjnlUbESxADp3S9MO3JVEZdKl7c",
    authDomain: "filmvisarnaab.firebaseapp.com",
    databaseURL: "https://filmvisarnaab.firebaseio.com",
    projectId: "filmvisarnaab",
    storageBucket: "filmvisarnaab.appspot.com",
    messagingSenderId: "231235037623",
    appId: "1:231235037623:web:02ede7a98895f59e09a032"
};

// Firebase app
let myFirebase = firebase.initializeApp(config);

// Firebase db
export const db = myFirebase.firestore();
export const auth = myFirebase.auth();

auth.onAuthStateChanged(user => {
  store.dispatch("fetchUser", user);
});

