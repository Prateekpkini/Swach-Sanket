export const errorHandler = (err, req, res, next) => {
  console.error("API Error:", err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Server error" });
};
