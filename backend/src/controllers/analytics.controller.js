import { Entry } from "../models/Entry.js";
import { toISTDateKey } from "../utils/date.js";

const sumEntry = (entry) =>
  Object.values(Object.fromEntries(entry?.data || [])).reduce((s, v) => s + (Number(v) || 0), 0);

export const sevenDayTrend = async (req, res, next) => {
  try {
    // Fetch last 7 entries for the user (by dateKey desc)
    const entries = await Entry.find({ user: req.user._id }).sort({ dateKey: -1 }).limit(7);
    const trend = entries
      .map((e) => ({ dateKey: e.dateKey, total: sumEntry(e) }))
      .sort((a, b) => a.dateKey.localeCompare(b.dateKey));
    res.json({ trend });
  } catch (e) { next(e); }
};

export const todaySummary = async (req, res, next) => {
  try {
    const todayKey = toISTDateKey();
    const entry = await Entry.findOne({ user: req.user._id, dateKey: todayKey });
    res.json({
      dateKey: todayKey,
      total: sumEntry(entry),
      materialsCount: entry ? Object.values(Object.fromEntries(entry.data)).filter(v => Number(v) > 0).length : 0
    });
  } catch (e) { next(e); }
};
