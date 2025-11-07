import { z } from "zod";
import { Entry } from "../models/Entry.js";
import { toISTDateKey } from "../utils/date.js";

const upsertSchema = z.object({
  dateKey: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  data: z.record(z.string(), z.number().nonnegative().finite()).default({})
});

export const getEntryByDate = async (req, res, next) => {
  try {
    const dateKey = req.query.dateKey || toISTDateKey();
    const entry = await Entry.findOne({ user: req.user._id, dateKey });
    res.json({ entry: entry || { dateKey, data: {} } });
  } catch (e) { next(e); }
};

export const upsertEntry = async (req, res, next) => {
  try {
    const { dateKey, data } = upsertSchema.parse({ ...req.body, dateKey: req.params.dateKey });
    const cleaned = {};
    Object.entries(data).forEach(([k, v]) => {
      const num = Number(v);
      if (!Number.isNaN(num)) cleaned[k] = Math.max(0, num);
    });

    const entry = await Entry.findOneAndUpdate(
      { user: req.user._id, dateKey },
      { $set: { data: cleaned } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json({ message: "Saved", entry });
  } catch (e) { next(e); }
};

export const deleteEntry = async (req, res, next) => {
  try {
    const dateKey = req.params.dateKey;
    await Entry.findOneAndDelete({ user: req.user._id, dateKey });
    res.json({ message: "Deleted", dateKey });
  } catch (e) { next(e); }
};

export const listHistory = async (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 30, 90);
    const entries = await Entry.find({ user: req.user._id })
      .sort({ dateKey: -1 })
      .limit(limit);
    res.json({ entries });
  } catch (e) { next(e); }
};
