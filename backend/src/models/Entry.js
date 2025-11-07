import mongoose from "mongoose";

/**
 * For each user + dateKey (YYYY-MM-DD IST), store a map of materialName -> weight (Number)
 */
const entrySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true, required: true },
    dateKey: { type: String, required: true, index: true }, // YYYY-MM-DD (IST)
    data: { type: Map, of: Number, default: {} }
  },
  { timestamps: true }
);

entrySchema.index({ user: 1, dateKey: 1 }, { unique: true });

export const Entry = mongoose.model("Entry", entrySchema);
