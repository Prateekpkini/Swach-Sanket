import { Material } from "../models/Material.js";

export const listMaterials = async (req, res, next) => {
  try {
    const materials = await Material.find().sort({ category: 1, name: 1 });
    res.json({ materials });
  } catch (e) {
    next(e);
  }
};
