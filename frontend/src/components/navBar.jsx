import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Page checks
  const isLoginPage = location.pathname === "/login";
  const isSignupPage = location.pathname === "/signup";
  const isForgotPasswordPage = location.pathname === "/forgot-password";
  const isResetPasswordPage = location.pathname === "/reset-password";

  return (
    <header className="bg-amber-100 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 flex-wrap">

          {/* Logo - Clickable to Home */}
          <div
            className="flex items-center space-x-4 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src="/assets/10001.png" // Make sure this is in public/assets
              alt="UP Gov Logo"
              className="h-10"
            />
          </div>

          {/* Right side - Buttons */}
          <div className="flex items-center space-x-4 mt-2 sm:mt-0">
            {(isLoginPage || isForgotPasswordPage) ? (
              <>
                <span className="text-sm text-gray-600">कोई खाता नहीं है?</span>
                <button
                  onClick={() => navigate("/signup")}
                  className="bg-orange-500 text-white px-4 py-2
                     rounded-md text-sm font-semibold
                     cursor-pointer
                     hover:bg-orange-800 transition-colors"
                >
                  एक बनाएँ
                </button>
              </>
            ) : isSignupPage ? (
              <>
                <span className="text-sm text-gray-600">खाता है?</span>
                <button
                  onClick={() => navigate("/login")}
                  className="bg-orange-500 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-orange-600 transition-colors"
                >
                  साइन इन करें
                </button>
              </>
            ) : isResetPasswordPage ? (
              <>
                <span className="text-sm text-gray-600">गलत ईमेल</span>
                <button
                  onClick={() => navigate("/forgot-password")}
                  className="bg-orange-500 text-white px-4 py-2 
                  rounded-md text-sm font-semibold hover:bg-orange-600
                   transition-colors"
                >
                  दुबारा ईमेल
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="bg-orange-500 text-white px-4 py-2 
                  rounded-md text-sm font-semibold hover:bg-orange-800 
                  transition-colors"
              >
                लॉगिन
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
