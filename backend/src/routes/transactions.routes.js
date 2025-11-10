// routes/transactions.routes.js
import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  getTransactionsByDate,
  createTransaction,
  getTransactionsHistory,
  deleteTransaction,
} from "../controllers/transactions.controller.js";

const router = Router();

/**
 * All routes require authentication
 */

// GET /api/transactions?dateKey=YYYY-MM-DD
router.get("/", requireAuth, getTransactionsByDate);

// GET /api/transactions/history?limit=30
router.get("/history", requireAuth, getTransactionsHistory);

// POST /api/transactions
router.post("/", requireAuth, createTransaction);

// DELETE /api/transactions/:id
router.delete("/:id", requireAuth, deleteTransaction);

export default router;

