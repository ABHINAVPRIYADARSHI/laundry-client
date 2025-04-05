import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDkAhCcQRlbU2IWbMo95TQYUoN01Z7TSkg",
    authDomain: "laundryproviderapp.firebaseapp.com",
    projectId: "laundryproviderapp",
    storageBucket: "laundryproviderapp.firebasestorage.app",
    messagingSenderId: "1094703491634",
    appId: "1:1094703491634:web:301bc2c704c0d44ec6ea2b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { auth, googleProvider, facebookProvider };