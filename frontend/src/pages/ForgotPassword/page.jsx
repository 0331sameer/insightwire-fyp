"use client";

import { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Simple password confirmation check
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      // Simulate password reset (replace with actual API call)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSuccess("Password reset instructions have been sent to your email.");
      setEmail("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setError("Failed to send reset instructions. Please try again.");
    } finally {
      setLoading(false);
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
        <p className="text-gray-500">Reset your password</p>
      </div>

      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md border border-gray-200">
        <div className="space-y-2 text-left">
          <h2 className="text-2xl font-semibold text-gray-900">
            Reset Password
          </h2>
          <p className="text-gray-500">
            Enter your email address, new password, and confirm your password to
            reset your password.
          </p>
        </div>

        {success ? (
          <div className="text-green-600 text-sm">
            {success} Please{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              sign in
            </Link>{" "}
            with your new password.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

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
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-900"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-900"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Reset Password"}
            </button>
          </form>
        )}

        <div className="text-center text-sm text-gray-500">
          Remembered your password?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
