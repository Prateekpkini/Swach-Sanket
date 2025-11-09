// import React, { useState } from 'react';
// import { Lock, Mail, Eye, EyeOff, Leaf, AlertCircle } from 'lucide-react'; 
// import { useNavigate } from "react-router-dom";
// import api from "../services/api"; 

// export default function LoginPage() {
//   const [email, setEmail] = useState('admin@swachsanket.com');
//   const [password, setPassword] = useState('admin123');
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');

//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setIsLoading(true);

//     const MOCK_MODE = !process.env.REACT_APP_API_BASE;

//     try {
//       let token;

//       if (MOCK_MODE) {
//         if (email === "admin@swachsanket.com" && password === "admin123") {
//           token = "fake-jwt-token";
//         } else {
//           throw new Error("Invalid mock credentials");
//         }
//       } else {
//         const resp = await api.post("/api/auth/login", { email, password });
//         token = resp.data.token || resp.data.accessToken;
//       }

//       localStorage.setItem("auth_token", token);
//       localStorage.setItem("user_email", email);
//       // navigate("/dashboard");
//       // navigate("/zilla-dashboard");
//       navigate("/driver-dashboard");
//     } catch (err) {
//       const errorMessage =
//         err.response?.data?.message || err.message || "Login failed. Please try again.";
//       setError(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center p-4">
//       {/* Background Pattern */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
//       </div>

//       {/* Login Card */}
//       <div className="relative w-full max-w-md">
//         <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
//           {/* Header Section */}
//           <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-8 text-center">
//             <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
//               <Leaf className="w-8 h-8 text-emerald-600" />
//             </div>
//             <h1 className="text-2xl font-bold text-white mb-2">
//               Zilla Panchayat MRF Portal
//             </h1>
//             <p className="text-emerald-50 text-sm">Smart Waste Management System</p>
//           </div>

//           {/* Form Section */}
//           <div className="p-8">
//             {error && (
//               <div
//                 role="alert"
//                 className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-start space-x-3"
//               >
//                 <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
//                 <span className="block sm:inline font-medium text-sm">{error}</span>
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Email Input */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Email Address
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Mail className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <input
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
//                     placeholder="admin@example.com"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Password Input */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Lock className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <input
//                     type={showPassword ? 'text' : 'password'}
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
//                     placeholder="••••••••"
//                     required
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                   >
//                     {showPassword ? (
//                       <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                     ) : (
//                       <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {/* Remember Me + Forgot Password */}
//               <div className="flex items-center justify-between">
//                 <label className="flex items-center">
//                   <input
//                     type="checkbox"
//                     className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
//                   />
//                   <span className="ml-2 text-sm text-gray-600">Remember me</span>
//                 </label>

//                 {/* ✅ FIXED: Changed from <a href="#"> to a button */}
//                 <button
//                   type="button"
//                   onClick={() => alert("Password recovery coming soon!")}
//                   className="text-sm font-medium text-emerald-600 hover:text-emerald-700 underline"
//                 >
//                   Forgot password?
//                 </button>
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transform transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isLoading ? (
//                   <span className="flex items-center justify-center">
//                     <svg
//                       className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       ></circle>
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       ></path>
//                     </svg>
//                     Signing in...
//                   </span>
//                 ) : (
//                   'Sign In'
//                 )}
//               </button>
//             </form>

//             {/* Demo Credentials
//             <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
//               <p className="text-xs text-gray-500 text-center mb-2 font-medium">
//                 Demo Credentials
//               </p>
//               <p className="text-sm text-gray-700 text-center">
//                 <span className="font-medium">Email:</span> admin@example.com
//               </p>
//               <p className="text-sm text-gray-700 text-center">
//                 <span className="font-medium">Password:</span> password123
//               </p>
//             </div> */}
//           </div>
//         </div>

//         {/* Footer */}
//         <p className="text-center text-white text-sm mt-6">
//           © 2024 Zilla Panchayat. All rights reserved.
//         </p>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect, useRef } from "react";
import { Lock, Mail, Eye, EyeOff, Leaf, AlertCircle, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // used to trigger auto-submit after state commit
  const quickLoginTrigger = useRef(null);

  // 🔹 React-safe auto-submit effect
  useEffect(() => {
    if (quickLoginTrigger.current && email && password) {
      quickLoginTrigger.current = null; // reset trigger
      handleSubmit({ preventDefault: () => {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password) {
      setError("Missing credentials, please try again.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post("/api/auth/login", { email, password });
      const data = response.data;

      console.log("✅ Login response:", data);

      // Store auth info
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user_email", data.user.email);
      localStorage.setItem("user_name", data.user.name);
      localStorage.setItem("user_role", data.user.role);
      localStorage.setItem("user_id", data.user.id);

      // Normalize role
      const role = (data.user?.role || "").toLowerCase();
      console.log("👤 Detected role:", role);

      switch (role) {
        case "zilla_panchayat":
          console.log("➡️ Redirecting to /zilla-dashboard");
          navigate("/zilla-dashboard");
          break;
        case "mrf_operator":
          console.log("➡️ Redirecting to /dashboard");
          navigate("/dashboard");
          break;
        case "mrf_driver":
          console.log("➡️ Redirecting to /driver-dashboard");
          navigate("/driver-dashboard");
          break;
        default:
          console.warn("⚠️ Unknown role, redirecting to /dashboard");
          navigate("/dashboard");
          break;
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Quick demo login (triggers auto-submit)
  const quickLogin = (role) => {
    const credentials = {
      zilla_panchayat: { email: "admin@example.com", password: "TestPass123" },
      mrf_operator: { email: "anirudha@example.com", password: "TestPass123" },
      mrf_driver: { email: "aniudupa15@gmail.com", password: "TestPass123" },
    };

    setEmail(credentials[role].email);
    setPassword(credentials[role].password);
    setError("");

    // mark for auto-submit after state updates
    quickLoginTrigger.current = true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
              <Leaf className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Swach Sanket MRF Portal
            </h1>
            <p className="text-emerald-50 text-sm">
              Smart Waste Management System
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            {error && (
              <div
                role="alert"
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-start space-x-3"
              >
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span className="block sm:inline font-medium text-sm">
                  {error}
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Remember me
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => alert("Password recovery coming soon!")}
                  className="text-sm font-medium text-emerald-600 hover:text-emerald-700 underline"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transform transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Quick Login Section */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500 flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    Quick Demo Login
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => quickLogin("zilla_panchayat")}
                  className="w-full px-4 py-2 border border-emerald-500 text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors text-sm font-medium"
                >
                  🏛️ Login as Admin (Zilla Panchayat)
                </button>
                <button
                  type="button"
                  onClick={() => quickLogin("mrf_operator")}
                  className="w-full px-4 py-2 border border-blue-500 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                >
                  👷 Login as MRF Operator
                </button>
                <button
                  type="button"
                  onClick={() => quickLogin("mrf_driver")}
                  className="w-full px-4 py-2 border border-purple-500 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors text-sm font-medium"
                >
                  🚛 Login as MRF Driver
                </button>
              </div>

              <p className="mt-4 text-xs text-gray-500 text-center">
                Click a button above to auto-fill credentials and sign in automatically
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white text-sm mt-6">
          © 2024 Swach Sanket. All rights reserved.
        </p>
      </div>
    </div>
  );
}
