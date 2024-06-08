import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDcX-U4oFf9czKIx68k_poQvVoDQSAa6iE",
  authDomain: "hotwheels-f1639.firebaseapp.com",
  projectId: "hotwheels-f1639",
  storageBucket: "hotwheels-f1639.appspot.com",
  messagingSenderId: "397253585572",
  appId: "1:397253585572:web:53f959e6f7026b002e5431"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

export { auth, db };
