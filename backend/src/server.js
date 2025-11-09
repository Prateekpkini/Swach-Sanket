import "dotenv/config.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import { rateLimit } from "./middleware/rateLimit.js";
import { errorHandler } from "./middleware/error.js";

import authRoutes from "./routes/auth.routes.js";
import materialsRoutes from "./routes/materials.routes.js";
import entriesRoutes from "./routes/entries.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";


const app = express();

app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use(rateLimit(60_000, 300));

app.use(cors({
  origin: "*",
  credentials: false,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.post("/superadmin", (req, res) => {
  const { username, password } = req.body; 

  if (username === "mrf123" && password === "mrf1234") {
    res.status(200).json({ message: "Access accepted " });
  } else if(username === "gram123" && password === "gram1234") {
    res.status(200).json({ message: "Access accepted " });
  }else if(username === "zilla123" && password === "zilla1234") {
    res.status(200).json({message: "Access accepted"});
  }else{
    res.status(401).json({ message: "Access denied" });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/materials", materialsRoutes);
app.use("/api/entries", entriesRoutes);
app.use("/api/analytics", analyticsRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});
