
import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  getEntryByDate,
  upsertEntry,
  deleteEntry,
  listHistory,
  aggregateAllPlants
} from "../controllers/entries.controller.js";

const router = Router();

/**
 * Notes:
 * - GET /api/entries/aggregate accepts:
 *   - dateKey=YYYY-MM-DD  (preferred) OR from=YYYY-MM-DD & to=YYYY-MM-DD (range)
 *   - optional plants=comma,separated,list (e.g. plants=yedapadavu,narikombu)
 *   - if `plants` is omitted, the controller defaults to all 4 plants
 *
 * - Other routes maintain existing behavior (user-scoped unless plantId provided).
 */

router.get("/", requireAuth, getEntryByDate);                 // ?dateKey=YYYY-MM-DD [&plantId=...]
router.get("/history", requireAuth, listHistory);             // ?limit=30 [&plantId=...]
router.get("/aggregate", requireAuth, aggregateAllPlants);    // ?dateKey=... OR ?from=...&to=... [&plants=...]
router.put("/:dateKey", requireAuth, upsertEntry);            // body: { data: { name: number }, plantId?: "yedapadavu" }
router.delete("/:dateKey", requireAuth, deleteEntry);         // ?plantId=...

export default router;
