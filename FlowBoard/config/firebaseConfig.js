import { initializeApp } from "firebase/app";

//import necessary services from Firebase
import { getFirestore } from "firebase/firestore";
import { API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID } from "../.my_settings";


import { getAuth } from "firebase/auth"


// // My web app's Firebase configuration

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get the firestore database instance using app configurations
export const db = getFirestore(app)

// initialize some of the built in authentication functions
export const auth = getAuth(app)