// routes/compliance.routes.js
import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { generateReport, generateReportFromEntry } from "../controllers/compliance.controller.js";

const router = Router();

/**
 * POST /api/compliance/generate
 * 
 * Generates a compliance report based on provided data (with pre-calculated metrics)
 * Requires authentication
 */
router.post("/generate", requireAuth, generateReport);

/**
 * POST /api/compliance/generate-from-entry
 * 
 * Generates a compliance report from entry data (material weights) + operational metadata
 * Automatically calculates metrics from the provided data
 * Requires authentication
 */
router.post("/generate-from-entry", requireAuth, generateReportFromEntry);

export default router;

