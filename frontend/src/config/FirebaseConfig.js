import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQ18MZxEVeDZOCIp-_LJkA8eAJBrDCqi0",
  authDomain: "interior-site-c31b3.firebaseapp.com",
  projectId: "interior-site-c31b3",
  storageBucket: "interior-site-c31b3.firebasestorage.app",
  messagingSenderId: "636697970725",
  appId: "1:636697970725:web:84d2a367a11f8ef57857cc",
  measurementId: "G-FHYH30ZDH1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();


// Authentication functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return {
      success: true,
      user: result.user,
      token: await result.user.getIdToken(),
    };
  } catch (error) {
    console.error("Google sign-in error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error("Sign-out error:", error);
    return { success: false, error: error.message };
  }
};

export default app;
