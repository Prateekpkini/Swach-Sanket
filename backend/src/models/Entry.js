// models/Entry.js
import mongoose from "mongoose";

/**
 * Entry model for MRF data.
 *
 * Fields:
 * - user: reference to the user who recorded the entry
 * - plantId: identifier for the MRF plant (one of the four allowed values)
 * - dateKey: string date key in YYYY-MM-DD (IST)
 * - data: object mapping materialName -> weight (Number)
 *
 * Indexes:
 * - Unique index on { plantId, dateKey } to help ensure one entry per plant per day
 */

const entrySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: true
    },
    plantId: {
      type: String,
      enum: ["yedapadavu", "narikombu", "ujire", "kedambadi"],
      required: true,
      index: true
    },
    dateKey: {
      type: String,
      required: true,
      index: true // format: YYYY-MM-DD (IST)
    },
    // Store as a plain object: materialName -> Number
    data: {
      type: Object,
      default: {}
    }
  },
  { timestamps: true }
);

// Ensure one entry per plant per date
entrySchema.index({ plantId: 1, dateKey: 1 }, { unique: true });

// (Optional) keep a user+date index for backward compatibility / quick user lookups
entrySchema.index({ user: 1, dateKey: 1 }, { unique: false });

export const Entry = mongoose.model("Entry", entrySchema);
