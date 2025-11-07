import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { sevenDayTrend, todaySummary } from "../controllers/analytics.controller.js";

const router = Router();
router.get("/seven-day-trend", requireAuth, sevenDayTrend);
router.get("/today", requireAuth, todaySummary);

export default router;
