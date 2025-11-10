// models/Transaction.js
import mongoose from "mongoose";

/**
 * Transaction model for tracking item shipments and sales
 *
 * Fields:
 * - user: reference to the user who recorded the transaction
 * - itemName: name of the item/material being shipped
 * - destination: where the item is being sent
 * - quantity: quantity in kg
 * - cost: cost/revenue in rupees
 * - date: date of transaction (YYYY-MM-DD format)
 * - notes: additional notes
 */

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: true
    },
    itemName: {
      type: String,
      required: true,
      trim: true
    },
    destination: {
      type: String,
      required: true,
      trim: true
    },
    quantity: {
      type: Number,
      default: 0,
      min: 0
    },
    cost: {
      type: Number,
      required: true,
      min: 0
    },
    date: {
      type: String,
      required: true,
      index: true // format: YYYY-MM-DD
    },
    notes: {
      type: String,
      default: "",
      trim: true
    }
  },
  { timestamps: true }
);

// Index for quick lookups by user and date
transactionSchema.index({ user: 1, date: 1 });

export const Transaction = mongoose.model("Transaction", transactionSchema);

