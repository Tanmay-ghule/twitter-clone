import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAaMsy0Aka2IVaavJrEgcgjNlXLoLeKahQ",
  authDomain: "twitter-3f922.firebaseapp.com",
  projectId: "twitter-3f922",
  storageBucket: "twitter-3f922.firebasestorage.app",
  messagingSenderId: "246405032362",
  appId: "1:246405032362:web:1d7a4a94a8145de00a63d3",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
