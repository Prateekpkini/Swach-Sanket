import "dotenv/config.js";
import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";

const seedUsers = async () => {
  try {
    await connectDB();
    
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: "admin@swachsanket.com" });
    if (existingAdmin) {
      console.log("Admin user already exists");
      return;
    }

    // Create admin user
    const adminUser = await User.create({
      email: "admin@swachsanket.com",
      password: "admin123", // This will be hashed automatically by the pre-save middleware
      name: "Admin User"
    });

    console.log("Admin user created successfully:");
    console.log(`Email: ${adminUser.email}`);
    console.log(`Name: ${adminUser.name}`);
    console.log("Password: admin123");
    
    // Create a test user
    const testUser = await User.create({
      email: "test@swachsanket.com", 
      password: "test123",
      name: "Test User"
    });

    console.log("Test user created successfully:");
    console.log(`Email: ${testUser.email}`);
    console.log(`Name: ${testUser.name}`);
    console.log("Password: test123");

  } catch (error) {
    console.error("Error seeding users:", error.message);
  } finally {
    process.exit(0);
  }
};

seedUsers();
