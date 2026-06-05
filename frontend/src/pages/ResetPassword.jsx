import React, { useState } from "react";
import Navbar from "../components/navBar.jsx";
import Footer from "../components/Footer.jsx";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
const email = state?.email || "";

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!otp || !password || !confirmPassword) {
      setError("Please fill all fields.");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password, confirmPassword }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to reset password.");

      // Redirect to success page after reset
      navigate("/password-reset-success");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[url('/assets/agra1.jpg')] 
     bg-cover bg-center bg-no-repeat min-h-screen font-sans flex flex-col">
      <Navbar />
      <main className="container mx-auto p-4 flex-grow flex items-center justify-center">
        <div className="w-full max-w-lg bg-white shadow-lg rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Reset Password
          </h2>

          {error && <p className="text-red-500 text-sm text-center 
          mb-4 bg-red-100 p-3 rounded-lg">{error}</p>}

          <form onSubmit={handleResetPassword} noValidate>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full px-4 py-3 bg-gray-100 border
                 border-gray-300 rounded-lg cursor-not-allowed"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border
                 border-gray-300 rounded-lg focus:outline-none focus:ring-2
                  focus:ring-gray-400"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium
               text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border
                 border-gray-300 rounded-lg focus:outline-none focus:ring-2
                  focus:ring-gray-400"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border
                 border-gray-300 rounded-lg focus:outline-none focus:ring-2
                  focus:ring-gray-400"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 rounded-lg
               text-white bg-gray-600 hover:bg-gray-700
                disabled:bg-gray-400  cursor-pointer"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResetPasswordPage;
