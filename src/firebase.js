import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBDgfpTRTGL1O0kFLtxj8BYDIiUdyr2GuA",
  authDomain: "chatty-3c4d1.firebaseapp.com",
  projectId: "chatty-3c4d1",
  storageBucket: "chatty-3c4d1.appspot.com",
  messagingSenderId: "82084718834",
  appId: "1:82084718834:web:5d9219bbc4516d7497486b",
  measurementId: "G-S2K64JZ1YK"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };