let hits = new Map();
// simple in-memory (ok for dev). Prefer express-rate-limit or Redis in prod.
export const rateLimit = (windowMs = 60_000, max = 120) => (req, res, next) => {
  const key = req.ip;
  const now = Date.now();
  if (!hits.has(key)) hits.set(key, []);
  const arr = hits.get(key).filter(ts => now - ts < windowMs);
  arr.push(now);
  hits.set(key, arr);
  if (arr.length > max) return res.status(429).json({ message: "Too many requests" });
  next();
};
