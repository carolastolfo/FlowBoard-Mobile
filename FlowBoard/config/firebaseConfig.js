import { initializeApp } from "firebase/app";

//import necessary services from Firebase
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCi-pWfbovUgWF7gVU6He0fmuEK31F91pw",
  authDomain: "winter25-51be3.firebaseapp.com",
  projectId: "winter25-51be3",
  storageBucket: "winter25-51be3.firebasestorage.app",
  messagingSenderId: "889208687119",
  appId: "1:889208687119:web:cbc1063639bcd97879717a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get the firestore database instance using app configurations
export const db = getFirestore(app)