// import jwt from "jsonwebtoken";
// import { User } from "../models/User.js";

// export const requireAuth = async (req, res, next) => {
//   try {
//     const auth = req.headers.authorization || "";
//     const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
//     if (!token) return res.status(401).json({ message: "Missing token" });

//     const payload = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(payload.sub).select("_id email name");
//     if (!user) return res.status(401).json({ message: "Invalid user" });

//     req.user = user;
//     next();
//   } catch (e) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }
// };


import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const requireAuth = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Missing token" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub).select("_id email name role isActive");
    if (!user) return res.status(401).json({ message: "Invalid user" });

    if (!user.isActive) {
      return res.status(403).json({ message: "Account is deactivated" });
    }

    req.user = user;
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