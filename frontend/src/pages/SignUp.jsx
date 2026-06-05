import React, { useState } from "react";
import Navbar from "../components/navBar.jsx"; 
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    gender: "",
    district: "",
    address: "",
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setApiError("");

    let formErrors = {};
    if (!formData.fullName) formErrors.fullName = "Name is required.";
    if (!formData.email) formErrors.email = "Email is required.";
    if (!formData.phone) formErrors.phone = "Phone number is required.";
    if (!formData.password) formErrors.password = "Password is required.";
    if (formData.password !== formData.confirmPassword) {
      formErrors.confirmPassword = "Passwords do not match.";
    }
    if (!formData.gender) formErrors.gender = "Gender is required.";
    if (!formData.district) formErrors.district = "District is required.";
    if (!formData.address) formErrors.address = "Address is required.";

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong during signup.");
      }

      if (data.success) {
        console.log("Signup successful:", data);
        login(data.user, data.token);
        navigate("/user-dashboard");
      }

    } catch (error) {
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[url('/assets/agra1.jpg')]
     min-h-screen font-sans flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex-grow 
      flex items-center justify-center">
        <div className="w-full max-w-4xl bg-white shadow-lg 
        rounded-xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">पंजीकरण</h2>

          {apiError && (
            <p className="text-red-500 text-sm 
            text-center mb-4 bg-red-100 p-3 rounded-lg">
              {apiError}
            </p>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Name */}
              <div className="md:col-span-1">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  नाम
                </label>
                <input
                  type="text"
                  name="fullName"
                  id="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-50
                   border border-gray-300 rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div className="md:col-span-1">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  ई मेल
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2
                   bg-gray-50 border border-gray-300 
                   rounded-lg focus:outline-none focus:ring-2
                    focus:ring-green-500"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div className="md:col-span-1">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  फोन नंबर
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 
                  rounded-lg focus:outline-none focus:ring-2
                   focus:ring-green-500"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Password */}
              <div className="md:col-span-1">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  पासवर्ड
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2
                   bg-gray-50 border border-gray-300 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="md:col-span-1">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  पासवर्ड की पुष्टि
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-50 border
                   border-gray-300 rounded-lg focus:outline-none 
                   focus:ring-2 focus:ring-green-500"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Gender */}
              <div className="md:col-span-1">
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  लिंग
                </label>
                <select
                  name="gender"
                  id="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-50 border
                   border-gray-300 rounded-lg focus:outline-none
                    focus:ring-2 focus:ring-green-500"
                >
                  <option value="">चुनें</option>
                  <option value="Male">पुरुष</option>
                  <option value="Female">महिला</option>
                  <option value="Other">अन्य</option>
                </select>
                {errors.gender && (
                  <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
                )}
              </div>

              {/* District */}
              <div className="md:col-span-1">
                <label
                  htmlFor="district"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  जनपद
                </label>
                <select
                  name="district"
                  id="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300
                   rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">चुनें</option>
                  <option value="Agra">Agra</option>
                  <option value="Lucknow">Lucknow</option>
                  <option value="Varanasi">Varanasi</option>
                </select>
                {errors.district && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.district}</p>
                )}
              </div>

              {/* Address */}
              <div className="md:col-span-3">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  पता
                </label>
                <textarea
                  name="address"
                  id="address"
                  rows="4"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-50 border
                   border-gray-300 rounded-lg focus:outline-none focus:ring-2
                    focus:ring-green-500"
                ></textarea>
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                )}
              </div>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto flex justify-center py-3 px-12 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 cursor-pointer disabled:bg-green-400 "
              >
                {loading ? "Submitting..." : "साइन अप"}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 mt-auto">
        <p className="text-sm font-black text-gray-900 hover:bg-amber-400">
          Copyright © 2025-26 e-SERVICES FOR CITIZEN by MLA Agra, GoUP
        </p>
      </footer>
    </div>
  );
};

export default SignUp;
