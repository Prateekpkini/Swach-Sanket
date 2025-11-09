import "dotenv/config.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { rateLimit } from "./middleware/rateLimit.js";
import { errorHandler } from "./middleware/error.js";

// Import memory-based routes
import authMemoryRoutes from "./routes/auth.memory.routes.js";
import { UserMemory } from "./models/User.memory.js";

const app = express();

app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use(rateLimit(60_000, 300)); // 300 req/min per IP

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  credentials: false,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

// Enhanced health check for memory storage
app.get("/api/health", (req, res) => {
  const userCount = UserMemory.getAll().length;
  res.json({ 
    ok: true,
    storage: "memory",
    users: userCount,
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Use memory-based auth routes
app.use("/api/auth", authMemoryRoutes);

// Seed initial users on server start
const initializeUsers = async () => {
  try {
    await UserMemory.seed();
    console.log("📝 Initial users seeded in memory");
  } catch (error) {
    console.error("❌ Error seeding initial users:", error.message);
  }
};

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log("💾 Using IN-MEMORY storage (no database required)");
  
  // Initialize users
  await initializeUsers();
  
  console.log("\n🔑 Available test accounts:");
  console.log("Admin: admin@swachsanket.com / admin123");
  console.log("Test:  test@swachsanket.com / test123");
  console.log("\n📋 API Endpoints:");
  console.log(`POST http://localhost:${PORT}/api/auth/register`);
  console.log(`POST http://localhost:${PORT}/api/auth/login`);
  console.log(`GET  http://localhost:${PORT}/api/auth/users (debug)`);
  console.log(`GET  http://localhost:${PORT}/api/health`);
});
