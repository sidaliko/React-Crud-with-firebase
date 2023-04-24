import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDfwZqnbFSxSZQF6kXrb38DiPTep0vdV9A",
  authDomain: "crud-firebase-react-47288.firebaseapp.com",
  projectId: "crud-firebase-react-47288",
  storageBucket: "crud-firebase-react-47288.appspot.com",
  messagingSenderId: "681970979546",
  appId: "1:681970979546:web:d29214eb377bd9cdc14be3",
  measurementId: "G-VXVGR5Q63V",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth();
