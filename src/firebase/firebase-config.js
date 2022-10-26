// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider,getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyDk8P027wSKjJVv3WrvRYPnMADAhSXRdII",
  authDomain: "hitraffic-882a3.firebaseapp.com",
  projectId: "hitraffic-882a3",
  storageBucket: "hitraffic-882a3.appspot.com",
  messagingSenderId: "755610488659",
  appId: "1:755610488659:web:7efdc405080669661f1ba6",
  measurementId: "G-57Z9TY1FXJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
// Variables de autenticacion
const provider = new GoogleAuthProvider();
const auth = getAuth(app);
export{app, auth, db, provider,analytics}


