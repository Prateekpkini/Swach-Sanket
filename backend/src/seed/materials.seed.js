import "dotenv/config.js";
import { connectDB } from "../config/db.js";
import { Material } from "../models/Material.js";

const materialList = [
  { category: "Paper", name: "News Paper", color: "#8b5cf6" },
  { category: "Paper", name: "White & colored paper", color: "#8b5cf6" },
  { category: "Paper", name: "Notebooks & other books", color: "#8b5cf6" },
  { category: "Paper", name: "Cardboard", color: "#8b5cf6" },
  { category: "Paper", name: "Plastic lined board/whiteboard", color: "#8b5cf6" },
  { category: "Plastic", name: "PET bottle", color: "#3b82f6" },
  { category: "Plastic", name: "LDPE/HDPE carry bags", color: "#3b82f6" },
  { category: "Plastic", name: "Milk packets", color: "#3b82f6" },
  { category: "Plastic", name: "HDPE (shampoo bottles, cleaners)", color: "#3b82f6" },
  { category: "Plastic", name: "PVC (plumbing pipes)", color: "#3b82f6" },
  { category: "Plastic", name: "PP (Food containers)", color: "#3b82f6" },
  { category: "Plastic", name: "PP carry bags", color: "#3b82f6" },
  { category: "Plastic", name: "Laminates", color: "#3b82f6" },
  { category: "Plastic", name: "Tetra paks", color: "#3b82f6" },
  { category: "Plastic", name: "Thermocol/PS", color: "#3b82f6" },
  { category: "Plastic", name: "Paper cups/plates", color: "#3b82f6" },
  { category: "Plastic", name: "MLP", color: "#3b82f6" },
  { category: "Metal", name: "Aluminium foils", color: "#ef4444" },
  { category: "Metal", name: "Aluminium/tin cans", color: "#ef4444" },
  { category: "Metal", name: "Other metals", color: "#ef4444" },
  { category: "Glass", name: "Glass", color: "#10b981" },
  { category: "Rubber", name: "Tyres", color: "#f59e0b" },
  { category: "Rubber", name: "Toys, gloves, others", color: "#f59e0b" },
  { category: "Textile", name: "Textiles (clothes, bags, rags, etc.)", color: "#ec4899" },
  { category: "Ceramic", name: "Ceramic (plates, cups, pots, etc.)", color: "#14b8a6" },
  { category: "Leather", name: "Leather (belts, bags, tyres etc.)", color: "#a855f7" },
  { category: "Footwear", name: "Sandals, shoes, etc.", color: "#6366f1" },
  { category: "Fibrous organic", name: "Coconut shells and husks", color: "#84cc16" },
  { category: "E-waste", name: "All kinds of E-waste", color: "#64748b" },
  { category: "Others", name: "Rejects (silt, hair, dust)", color: "#78716c" }
];

const run = async () => {
  await connectDB();
  const count = await Material.countDocuments();
  if (count > 0) {
    console.log("Materials already seeded.");
    process.exit(0);
  }
  await Material.insertMany(materialList);
  console.log(`Seeded ${materialList.length} materials.`);
  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
