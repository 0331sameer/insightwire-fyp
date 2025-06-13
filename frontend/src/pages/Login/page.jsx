"use client";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Cookies from "js-cookie";
import { FcGoogle } from "react-icons/fc";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Label } from "../../components/ui/label";

// src/firebase.js
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login without backend call
    if (email && password) {
      // Create mock user data
      const mockUser = {
        _id: "mock-id",
        userName: email.split("@")[0],
        email: email,
        authType: "local",
        role: "user",
      };

      const mockToken = "mock-jwt-token";

      // Store mock token and user data in cookies
      const cookieOptions = {
        expires: rememberMe ? 7 : 1, // 7 days if remember me is checked, 1 day if not
        secure: false, // Set to false for development
        sameSite: "strict",
      };

      Cookies.set("token", mockToken, cookieOptions);
      Cookies.set("user", JSON.stringify(mockUser), cookieOptions);

      alert("Login successful!");
      navigate("/news"); // Navigate to news page after successful login
    } else {
      alert("Please enter both email and password.");
    }

    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Create mock user data from Google profile
      const mockUser = {
        _id: "google-mock-id",
        userName: user.displayName,
        email: user.email,
        authType: "google",
        role: "user",
        profilePic: user.photoURL,
        googleProfile: {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        },
      };

      const mockToken = "mock-google-jwt-token";

      // Store mock token and user data in cookies
      const cookieOptions = {
        expires: 7, // 7 days for Google login
        secure: false, // Set to false for development
        sameSite: "strict",
      };

      Cookies.set("token", mockToken, cookieOptions);
      Cookies.set("user", JSON.stringify(mockUser), cookieOptions);

      alert("Google login successful!");
      navigate("/news");
    } catch (error) {
      alert("An error occurred during Google login. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-2">
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="16" y="0" width="8" height="40" fill="#222" />
            <rect x="0" y="16" width="8" height="24" fill="#222" />
            <rect x="32" y="16" width="8" height="24" fill="#222" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">InsightWire</h1>
        <p className="text-gray-500">Sign in to your account</p>
      </div>

      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md border border-gray-200">
        <div className="space-y-2 text-left">
          <h2 className="text-2xl font-semibold text-gray-900">Sign In</h2>
          <p className="text-gray-500">
            Enter your email and password to access your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-900"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-900"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-gray-400 bg-gray-100"
            />
            <label htmlFor="remember" className="text-sm text-gray-600">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-400">
              Or continue with
            </span>
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
          >
            <FcGoogle className="w-5 h-5 mr-2" />
            Sign in with Google
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
