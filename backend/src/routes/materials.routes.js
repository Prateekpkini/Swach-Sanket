import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { listMaterials } from "../controllers/materials.controller.js";

const router = Router();
router.get("/", requireAuth, listMaterials);
export default router;
