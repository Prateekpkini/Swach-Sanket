// controllers/transactions.controller.js
import { z } from "zod";
import { Transaction } from "../models/Transaction.js";

/**
 * Schemas
 */
const createTransactionSchema = z.object({
  itemName: z.string().min(1, "Item name is required"),
  destination: z.string().min(1, "Destination is required"),
  quantity: z.number().nonnegative().optional().default(0),
  cost: z.number().nonnegative("Cost must be non-negative"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  notes: z.string().optional().default(""),
});

/**
 * GET /api/transactions?dateKey=YYYY-MM-DD
 * Get transactions for a specific date
 */
export const getTransactionsByDate = async (req, res, next) => {
  try {
    const dateKey = req.query.dateKey;
    const query = { user: req.user._id };
    if (dateKey) {
      query.date = dateKey;
    }

    const transactions = await Transaction.find(query)
      .sort({ date: -1, createdAt: -1 })
      .lean();

    res.json({ transactions });
  } catch (e) {
    next(e);
  }
};

/**
 * POST /api/transactions
 * Create a new transaction
 */
export const createTransaction = async (req, res, next) => {
  try {
    const parsed = createTransactionSchema.parse(req.body);
    const transaction = await Transaction.create({
      ...parsed,
      user: req.user._id,
    });

    res.status(201).json({
      message: "Transaction created successfully",
      transaction,
    });
  } catch (e) {
    if (e.name === "ZodError") {
      return res.status(400).json({
        message: "Validation error",
        errors: e.errors,
      });
    }
    next(e);
  }
};

/**
 * GET /api/transactions/history?limit=30
 * Get transaction history
 */
export const getTransactionsHistory = async (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 30, 100);
    const transactions = await Transaction.find({ user: req.user._id })
      .sort({ date: -1, createdAt: -1 })
      .limit(limit)
      .lean();

    res.json({ transactions });
  } catch (e) {
    next(e);
  }
};

/**
 * DELETE /api/transactions/:id
 * Delete a transaction
 */
export const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: "Transaction deleted successfully" });
  } catch (e) {
    next(e);
  }
};

