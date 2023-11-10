// firebase.js
import { initializeApp } from "firebase/compat/app";
import firebase from "firebase/compat/app";
import { signInWithPopup } from "firebase/compat/auth";
import { OAuthProvider, GoogleAuthProvider, getAuth } from "firebase/auth";
// import { getDatabase, ref, query, onChildAdded } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA_4LCImnqI8Oi7pS_RI6ewwV4014rQjzg",
  authDomain: "briefcase-b5d63.firebaseapp.com",
  projectId: "briefcase-b5d63",
  storageBucket: "briefcase-b5d63.appspot.com",
  messagingSenderId: "1017978940318",
  appId: "1:1017978940318:web:74d9927285b9fc2a7f448f",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.setCustomParameters({
  prompt: "select_account",
  //   redirect_uri: "https://briefcase-b5d63.firebaseapp.com",
});

export { firebaseApp, auth, googleAuthProvider };

// Get a reference to the database service
// const database = getDatabase(firebaseApp);

// export { database, ref, query, onChildAdded, firebaseApp };
