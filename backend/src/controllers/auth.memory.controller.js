  // import jwt from "jsonwebtoken";
  // import { z } from "zod";
  // import { UserMemory } from "../models/User.memory.js";

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
      
  //     const user = await UserMemory.create(body);
  //     const token = signToken(user.id);
      
  //     res.status(201).json({ 
  //       token, 
  //       user: { 
  //         id: user.id, 
  //         email: user.email, 
  //         name: user.name 
  //       } 
  //     });
  //   } catch (error) {
  //     if (error.message === 'Email already exists') {
  //       return res.status(409).json({ message: "Email already registered" });
  //     }
  //     next(error);
  //   }
  // };

  // export const login = async (req, res, next) => {
  //   try {
  //     const { email, password } = authSchema.pick({ email: true, password: true }).parse(req.body);
      
  //     const user = await UserMemory.findOne({ email });
  //     if (!user || !(await user.comparePassword(password))) {
  //       return res.status(401).json({ message: "Invalid credentials" });
  //     }
      
  //     const token = signToken(user.id);
  //     res.json({ 
  //       token, 
  //       user: { 
  //         id: user.id, 
  //         email: user.email, 
  //         name: user.name 
  //       } 
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  // // Debug endpoint to see all users (remove in production)
  // export const getAllUsers = (req, res) => {
  //   const users = UserMemory.getAll().map(user => ({
  //     id: user.id,
  //     email: user.email,
  //     name: user.name,
  //     createdAt: user.createdAt
  //   }));
  //   res.json({ users });
  // };

  // // Seed users endpoint
  // export const seedUsers = async (req, res) => {
  //   try {
  //     await UserMemory.seed();
  //     res.json({ message: "Users seeded successfully" });
  //   } catch (error) {
  //     res.status(500).json({ message: error.message });
  //   }
  // };


import jwt from "jsonwebtoken";
import { z } from "zod";
import { UserMemory } from "../models/User.memory.js";

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

export const register = async (req, res, next) => {
  try {
    const body = authSchema.parse(req.body);
    
    const user = await UserMemory.create(body);
    const token = signToken(user.id, user.role);
    
    res.status(201).json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name,
        role: user.role
      } 
    });
  } catch (error) {
    if (error.message === 'Email already exists') {
      return res.status(409).json({ message: "Email already registered" });
    }
    if (error.message.includes('Invalid role')) {
      return res.status(400).json({ message: error.message });
    }
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: error.errors 
      });
    }
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    
    const user = await UserMemory.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Account is deactivated" });
    }
    
    const token = signToken(user.id, user.role);
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name,
        role: user.role
      } 
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: error.errors 
      });
    }
    next(error);
  }
};

// Get current user info
export const getCurrentUser = (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role
    }
  });
};

// Debug endpoint to see all users (remove in production)
export const getAllUsers = (req, res) => {
  const users = UserMemory.getAll().map(user => ({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt
  }));
  res.json({ users });
};

// Get users by role
export const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const validRoles = ['zilla_panchayat', 'mrf_operator', 'mrf_driver'];
    
    if (!validRoles.includes(role)) {
      return res.status(400).json({ 
        message: "Invalid role. Must be: zilla_panchayat, mrf_operator, or mrf_driver" 
      });
    }

    const users = await UserMemory.findByRole(role);
    res.json({ 
      role,
      count: users.length,
      users: users.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isActive: user.isActive
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Seed users endpoint
export const seedUsers = async (req, res) => {
  try {
    await UserMemory.seed();
    res.json({ message: "Users seeded successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};