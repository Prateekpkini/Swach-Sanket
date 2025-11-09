// import jwt from "jsonwebtoken";
// import { UserMemory } from "../models/User.memory.js";

// export const requireAuthMemory = async (req, res, next) => {
//   try {
//     const auth = req.headers.authorization || "";
//     const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
//     if (!token) return res.status(401).json({ message: "Missing token" });

//     const payload = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await UserMemory.findById(payload.sub);
//     if (!user) return res.status(401).json({ message: "Invalid user" });

//     // Don't include password in req.user
//     req.user = {
//       id: user.id,
//       email: user.email,
//       name: user.name
//     };
//     next();
//   } catch (e) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }
// };


import jwt from "jsonwebtoken";
import { UserMemory } from "../models/User.memory.js";

export const requireAuthMemory = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Missing token" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserMemory.findById(payload.sub);
    if (!user) return res.status(401).json({ message: "Invalid user" });

    if (!user.isActive) {
      return res.status(403).json({ message: "Account is deactivated" });
    }

    // Don't include password in req.user
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive
    };
    next();
  } catch (e) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// Middleware to check specific roles
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: "Access denied. Insufficient permissions.",
        required: roles,
        current: req.user.role
      });
    }

    next();
  };
};

// Middleware for admin only (Zilla Panchayat)
export const requireAdmin = requireRole('zilla_panchayat');

// Middleware for MRF staff (Operator and Driver)
export const requireMRFStaff = requireRole('mrf_operator', 'mrf_driver');

// Middleware for MRF Operator only
export const requireOperator = requireRole('mrf_operator');

// Middleware for MRF Driver only
export const requireDriver = requireRole('mrf_driver');