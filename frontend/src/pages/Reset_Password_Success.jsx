import React from "react";
import Navbar from "../components/navBar.jsx";
import Footer from "../components/Footer.jsx";
import { useNavigate } from "react-router-dom";

const PasswordResetSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[url('/assets/agra1.jpg')] 
     bg-cover bg-center bg-no-repeat
    min-h-screen font-sans flex flex-col">
      <Navbar />
      <main className="container mx-auto p-4 flex-grow flex items-center 
      justify-center">
        <div className="w-full max-w-lg bg-white shadow-lg 
        rounded-xl p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" 
            className="h-16 w-16 text-green-500 mx-auto mb-4" 
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 
              9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Password Reset Successful!
          </h2>
          <p className="text-gray-600 mb-8">
            Your password has been changed successfully. 
            You can now log in with your new password.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full md:w-auto inline-flex justify-center  cursor-pointer
            py-3 px-8 rounded-lg text-white bg-gray-600 hover:bg-gray-700"
          >
            Click here to go to the Login Page
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PasswordResetSuccessPage;
