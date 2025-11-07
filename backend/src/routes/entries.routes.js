import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { getEntryByDate, upsertEntry, deleteEntry, listHistory } from "../controllers/entries.controller.js";

const router = Router();

router.get("/", requireAuth, getEntryByDate);                 // ?dateKey=YYYY-MM-DD
router.get("/history", requireAuth, listHistory);             // ?limit=30
router.put("/:dateKey", requireAuth, upsertEntry);            // body: { data: { name: number } }
router.delete("/:dateKey", requireAuth, deleteEntry);

export default router;
