import { initializeApp } from "firebase/app";

//import necessary services from Firebase
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get the firestore database instance using app configurations
export const db = getFirestore(app)