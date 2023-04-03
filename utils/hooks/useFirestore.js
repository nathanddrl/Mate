import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// make the export for this useFirestore hook
export default db;
