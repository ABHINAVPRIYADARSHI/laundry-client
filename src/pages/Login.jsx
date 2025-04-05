import React, { useEffect, useState } from "react";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom"; // ✅ step 1
import laundryImage from "../assets/pwa-512x512.png";

export default function Login() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // ✅ step 2

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      setUser(user);

      // ✅ Save user info in Supabase
      const { error } = await supabase.from("users").upsert(
        [
          {
            firebase_uid: user.uid,
            name: user.displayName,
            email: user.email,
          },
        ],
        { onConflict: ["firebase_uid"] }
      );

      if (error) {
        console.error("Supabase insert error:", error.message);
      } else {
        navigate("/shops"); // ✅ redirect after successful login
      }
    } catch (error) {
      console.error("Google login error:", error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        navigate("/shops"); // ✅ auto-redirect if already logged in
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-300 via-pink-200 to-yellow-200">
      <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-8 sm:p-10 max-w-md w-full text-center">
        <img
          src={laundryImage}
          alt="Laundry Illustration"
          className="w-40 mx-auto mb-6"
        />
        <h1 className="text-3xl font-extrabold text-purple-700 mb-2">
          Welcome to Laundry Studio
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Sign in to view services, place orders, and track your laundry!
        </p>

        {user ? (
          <div className="text-center">
            <p className="text-lg font-medium text-gray-800">
              Hi, {user.displayName} 👋
            </p>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
        ) : (
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-3 bg-white px-6 py-2 border border-gray-300 rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105 mx-auto"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google icon"
              className="w-5 h-5"
            />
            <span className="text-sm font-medium text-gray-700">Sign in with Google</span>
          </button>
        )}
      </div>
    </div>
  );
}
