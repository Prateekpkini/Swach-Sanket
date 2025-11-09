// // src/components/ProtectedRoute.jsx
// import React from "react";
// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ children }) => {
//   const token = localStorage.getItem("auth_token");
//   if (!token) return <Navigate to="/login" replace />;
//   return children;
// };

// export default ProtectedRoute;


// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute component with role-based access control
 * 
 * @param {React.ReactNode} children - Component to render if authorized
 * @param {string|string[]} allowedRoles - Single role or array of roles allowed to access this route
 * @param {string} redirectTo - Where to redirect if not authorized (default: /login)
 */
const ProtectedRoute = ({ 
  children, 
  allowedRoles = null, 
  redirectTo = "/login" 
}) => {
  const token = localStorage.getItem("auth_token");
  const userRole = localStorage.getItem("user_role");

  // Check if user is authenticated
  if (!token) {
    console.log("❌ No token found - redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // If specific roles are required, check user's role
  if (allowedRoles) {
    const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    
    if (!userRole) {
      console.log("❌ No user role found - redirecting to login");
      return <Navigate to="/login" replace />;
    }

    if (!rolesArray.includes(userRole)) {
      console.log(`❌ Access denied. User role: ${userRole}, Required: ${rolesArray.join(', ')}`);
      
      // Redirect to appropriate dashboard based on user's actual role
      const dashboardMap = {
        'zilla_panchayat': '/zilla-dashboard',
        'mrf_operator': '/dashboard',
        'mrf_driver': '/driver-dashboard'
      };
      
      const userDashboard = dashboardMap[userRole] || '/login';
      return <Navigate to={userDashboard} replace />;
    }
  }

  console.log(`✅ Access granted for role: ${userRole}`);
  return children;
};

export default ProtectedRoute;