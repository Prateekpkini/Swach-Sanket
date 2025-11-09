import mongoose from "mongoose";

const materialSchema = new mongoose.Schema(
  {
    category: { type: String, required: true, index: true },
    name: { type: String, required: true, unique: true },
    color: { type: String, default: "#8884d8" }
  },
  { timestamps: true }
);

export const Material = mongoose.model("Material", materialSchema);
