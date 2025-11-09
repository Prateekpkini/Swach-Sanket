// import jwt from "jsonwebtoken";
// import { z } from "zod";
// import { User } from "../models/User.js";

// const authSchema = z.object({
//   email: z.string().email(),
//   password: z.string().min(6),
//   name: z.string().optional()
// });

// const signToken = (userId) =>
//   jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

// export const register = async (req, res, next) => {
//   try {
//     const body = authSchema.parse(req.body);
//     const existing = await User.findOne({ email: body.email });
//     if (existing) return res.status(409).json({ message: "Email already registered" });

//     const user = await User.create(body);
//     const token = signToken(user._id);
//     res.status(201).json({ token, user: { id: user._id, email: user.email, name: user.name } });
//   } catch (e) {
//     next(e);
//   }
// };

// export const login = async (req, res, next) => {
//   try {
//     const { email, password } = authSchema.pick({ email: true, password: true }).parse(req.body);
//     const user = await User.findOne({ email });
//     if (!user || !(await user.comparePassword(password))) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }
//     const token = signToken(user._id);
//     res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
//   } catch (e) {
//     next(e);
//   }
// };



import jwt from "jsonwebtoken";
import { z } from "zod";
import { User } from "../models/User.js";
import { sendMail } from "../utils/mailer.js";

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1, "Name is required"),
  role: z.enum(['zilla_panchayat', 'mrf_operator', 'mrf_driver'])
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const signToken = (userId, role) =>
  jwt.sign(
    { sub: userId, role }, 
    process.env.JWT_SECRET, 
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

 // ✅ import mail helper

export const register = async (req, res, next) => {
  try {
    // Validate input
    const body = authSchema.parse(req.body);

    // Check if email already exists
    const existing = await User.findOne({ email: body.email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Create new user
    const user = await User.create(body);
    const token = signToken(user._id, user.role);

    // ✅  Send confirmation email
    try {
      const subject = `Your ${user.role.toUpperCase()} account is registered successfully`;

      const message = `
        Dear ${user.name || "User"},
        
        Your ${user.role} account has been successfully registered in the Zilla Panchayat system.
        
        📧 Email: ${user.email}
        🔐 Password: ${body.password}
        🧩 Role: ${user.role}
        
        Please log in to your dashboard and change your password after first login.
        
        Regards,
        Zilla Panchayat Admin
      `;

      await sendMail({
        to: user.email,
        subject,
        text: message,
        html: `<div style="font-family:Arial,sans-serif;line-height:1.5">
          <h2 style="color:#1e3a8a;">Zilla Panchayat Account Registration</h2>
          <p>Dear <b>${user.name || "User"}</b>,</p>
          <p>Your <b>${user.role}</b> account has been created successfully.</p>
          <ul>
            <li><b>Email:</b> ${user.email}</li>
            <li><b>Password:</b> ${body.password}</li>
            <li><b>Role:</b> ${user.role}</li>
          </ul>
          <p>Please log in and change your password after your first login.</p>
          <p style="margin-top:20px;">Regards,<br><b>Zilla Panchayat Admin</b></p>
        </div>`,
      });

      console.log(`📧 Registration email sent to ${user.email}`);
    } catch (mailErr) {
      console.error("⚠️ Email sending failed:", mailErr);
      // continue even if mail fails
    }

    // Respond with success
    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      message: "User registered successfully and email sent",
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: e.errors,
      });
    }
    next(e);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Account is deactivated" });
    }
    
    const token = signToken(user._id, user.role);
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        email: user.email, 
        name: user.name,
        role: user.role
      } 
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: e.errors 
      });
    }
    next(e);
  }
};

// Get current user info
export const getCurrentUser = async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role
    }
  });
};