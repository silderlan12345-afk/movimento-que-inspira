import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB-mNc9vXk7fGDD_qh3P9yzIGSR0F8tUnU",
  authDomain: "movimento-que-inspira.firebaseapp.com",
  projectId: "movimento-que-inspira",
  storageBucket: "movimento-que-inspira.firebasestorage.app",
  messagingSenderId: "740463739427",
  appId: "1:740463739427:web:f4340a56cbb30005b86796"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };