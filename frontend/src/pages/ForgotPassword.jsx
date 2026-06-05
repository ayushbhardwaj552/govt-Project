import React, { useState } from "react";
import Navbar from "../components/navBar.jsx";
import Footer from "../components/Footer.jsx";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  // Helper function to validate email format
  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    // --- Client-side validation ---
    if (!email) {
      setError("Please enter your email address.");
      setLoading(false);
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      // Handle specific "not found" error from backend
      if (response.status === 404) {
        throw new Error("This email is not registered with us.");
      }
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP.");
      }

      setSuccessMessage(data.message);
      // Navigate to the reset password page after a short delay
      setTimeout(() => {
       navigate("/reset-password", { state: { email } });
 // Pass email to the next page
      }, 1500);

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
      <main className="container mx-auto p-4 flex-grow flex items-center
       justify-center">
        <div className="w-full max-w-lg bg-white shadow-lg rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Forgot Password</h2>

          {error && <p className="text-red-500 text-sm text-center mb-4
           bg-red-100 p-3 rounded-lg">{error}</p>}
          {successMessage && <p className="text-green-600 text-sm
           text-center mb-4 bg-green-100 p-3 rounded-lg">{successMessage}</p>}

          <form onSubmit={handleRequestOtp} noValidate>
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium
               text-gray-700 mb-2">
                Enter your email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              {loading ? "Sending..." : "Proceed"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};


export default ForgotPasswordPage;
