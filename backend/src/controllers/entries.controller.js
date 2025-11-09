// controllers/entries.controller.js
import { z } from "zod";
import { Entry } from "../models/Entry.js";
import { toISTDateKey } from "../utils/date.js";

/**
 * Schemas
 */
const upsertSchema = z.object({
  dateKey: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  data: z.record(z.string(), z.number().nonnegative().finite()).default({}),
  plantId: z.string().optional()
});

/**
 * GET /api/entries?dateKey=YYYY-MM-DD[&plantId=...]
 *
 * - If plantId is provided, returns the entry for that plant & date (if any).
 * - If plantId is NOT provided, returns the entry for the authenticated user (existing behaviour).
 */
export const getEntryByDate = async (req, res, next) => {
  try {
    const dateKey = req.query.dateKey || toISTDateKey();
    const plantId = req.query.plantId;

    let entry = null;

    if (plantId) {
      // fetch by plant + date
      entry = await Entry.findOne({ plantId, dateKey }).lean();
    } else {
      // existing behaviour: fetch by user + date
      entry = await Entry.findOne({ user: req.user._id, dateKey }).lean();
    }

    res.json({ entry: entry || { dateKey, data: {} } });
  } catch (e) {
    next(e);
  }
};

/**
 * PUT /api/entries/:dateKey
 *
 * Body: { data: { ... }, plantId?: "plant1" }
 *
 * - If plantId is provided in body, it will upsert the entry for that plant.
 * - Otherwise it will upsert the entry for the authenticated user (existing behaviour).
 */
export const upsertEntry = async (req, res, next) => {
  try {
    const parsed = upsertSchema.parse({ ...req.body, dateKey: req.params.dateKey });
    const { dateKey, data, plantId } = parsed;

    // Clean numeric values
    const cleaned = {};
    Object.entries(data).forEach(([k, v]) => {
      const num = Number(v);
      if (!Number.isNaN(num)) cleaned[k] = Math.max(0, num);
    });

    // Decide query key: by plantId OR by user
    let query;
    let update;
    if (plantId) {
      query = { plantId, dateKey };
      update = { $set: { data: cleaned, plantId } };
    } else {
      query = { user: req.user._id, dateKey };
      update = { $set: { data: cleaned, user: req.user._id } };
    }

    const entry = await Entry.findOneAndUpdate(
      query,
      update,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    res.json({ message: "Saved", entry });
  } catch (e) {
    next(e);
  }
};

/**
 * DELETE /api/entries/:dateKey[?plantId=plant1]
 *
 * - If plantId query param provided, deletes entry for that plant + date.
 * - Otherwise deletes the authenticated user's entry for that date.
 */
export const deleteEntry = async (req, res, next) => {
  try {
    const dateKey = req.params.dateKey;
    const plantId = req.query.plantId;

    if (plantId) {
      await Entry.findOneAndDelete({ plantId, dateKey });
    } else {
      await Entry.findOneAndDelete({ user: req.user._id, dateKey });
    }

    res.json({ message: "Deleted", dateKey });
  } catch (e) {
    next(e);
  }
};

/**
 * GET /api/entries/history?limit=30[&plantId=plant1]
 *
 * - If plantId provided, returns history for that plant.
 * - Otherwise returns history for authenticated user.
 */
export const listHistory = async (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 30, 90);
    const plantId = req.query.plantId;

    const q = plantId ? { plantId } : { user: req.user._id };

    const entries = await Entry.find(q)
      .sort({ dateKey: -1 })
      .limit(limit)
      .lean();

    res.json({ entries });
  } catch (e) {
    next(e);
  }
};

/**
 * NEW: GET /api/entries/aggregate
 *
 * Behavior required:
 * - Primary input is a single date (dateKey=YYYY-MM-DD). If not provided, defaults to today's IST date.
 * - Optional: from & to (date range). If provided, range used instead of single date.
 * - Optional: plants=comma,separated list. If omitted, default to all four plants.
 *
 * Example:
 *  GET /api/entries/aggregate?dateKey=2025-11-08
 *  GET /api/entries/aggregate?dateKey=2025-11-08&plants=yedapadavu,narikombu
 *  GET /api/entries/aggregate?from=2025-11-01&to=2025-11-07
 */
export const aggregateAllPlants = async (req, res, next) => {
  try {
    // Accept dateKey OR a range (from,to). If neither, default dateKey to today (IST).
    let { dateKey, from, to, plants } = req.query;

    if (!dateKey && !(from && to)) {
      // default to today's dateKey in IST
      dateKey = toISTDateKey();
    }

    const ALL_PLANTS = ["yedapadavu", "narikombu", "ujire", "kedambadi"];

    // parse plants param; default to ALL_PLANTS when not provided or empty
    let plantArray = ALL_PLANTS;
    if (typeof plants === "string" && plants.trim().length > 0) {
      plantArray = plants.split(",").map(p => p.trim()).filter(Boolean);
      // sanitize: only allow known plant ids
      plantArray = plantArray.filter(p => ALL_PLANTS.includes(p));
      if (plantArray.length === 0) plantArray = ALL_PLANTS;
    }

    // build query: include plant filter
    const q = { plantId: { $in: plantArray } };
    if (dateKey) q.dateKey = dateKey;
    else q.dateKey = { $gte: from, $lte: to };

    // find matching entries
    const entries = await Entry.find(q).lean();

    // Aggregate per plant and overall
    const perPlant = {};
    const overall = {};
    // initialize perPlant with empty objects for predictable keys
    plantArray.forEach(pid => (perPlant[pid] = {}));

    entries.forEach(entry => {
      const pid = entry.plantId || "unknown";
      const dataObj = entry.data || {};
      const items = (dataObj instanceof Map) ? Array.from(dataObj.entries()) : Object.entries(dataObj);

      items.forEach(([name, val]) => {
        const weight = Number(val) || 0;
        perPlant[pid][name] = (perPlant[pid][name] || 0) + weight;
        overall[name] = (overall[name] || 0) + weight;
      });
    });

    res.json({
      query: {
        dateKey: dateKey || null,
        from: from || null,
        to: to || null,
        plants: plantArray
      },
      counts: { perPlant, overall },
      meta: { entriesCount: entries.length }
    });
  } catch (e) {
    next(e);
  }
};
