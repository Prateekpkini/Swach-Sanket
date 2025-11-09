import { Router } from "express";
import { 
  login, 
  register, 
  getAllUsers, 
  seedUsers 
} from "../controllers/auth.memory.controller.js";
import { requireAuthMemory } from "../middleware/auth.memory.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);

// Debug routes (remove in production)
router.get("/users", getAllUsers);
router.post("/seed", seedUsers);

// Protected route example
router.get("/profile", requireAuthMemory, (req, res) => {
  res.json({ user: req.user });
});

export default router;
