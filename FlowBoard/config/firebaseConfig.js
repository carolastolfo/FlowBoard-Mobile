import { initializeApp } from "firebase/app";

//import necessary services from Firebase
import { getFirestore } from "firebase/firestore";

import { getAuth } from "firebase/auth"

const firebaseConfig = {
// Copy the initialization code from firestore and save it here

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get the firestore database instance using app configurations
export const db = getFirestore(app)

// initialize some of the built in authentication functions
export const auth = getAuth(app)