import { initializeApp } from "firebase/app";

//import necessary services from Firebase
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
// Copy the initialization code from firestore and save it here
apiKey: "AIzaSyCx1fsj_8i0_Hktji9a8B0W0ijwK4gmVkY",
authDomain: "winter25-63d21.firebaseapp.com",
projectId: "winter25-63d21",
storageBucket: "winter25-63d21.firebasestorage.app",
messagingSenderId: "518327692923",
appId: "1:518327692923:web:28ffd635ca26d326d6bcde"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get the firestore database instance using app configurations
export const db = getFirestore(app)