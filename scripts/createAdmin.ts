// Run this script to create your first admin user
// Usage: npx ts-node scripts/createAdmin.ts

import mongoose from "mongoose";
import Admin from "../models/Admin";

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    const MONGODB_URI =
      process.env.MONGO_URI || "your-mongodb-connection-string";
    await mongoose.connect(MONGODB_URI);

    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: "admin" });

    if (existingAdmin) {
      console.log("Admin user already exists!");
      process.exit(0);
    }

    // Create new admin
    const admin = await Admin.create({
      name: "Ransilu Koralege",
      username: "ransilu",
      password: "Ransilu5467!%3", // Change this password!
      role: "superadmin",
      isActive: true,
    });

    console.log("Admin created successfully!");
    console.log("Username:", admin.username);
    console.log("Password: admin123 (Please change this after first login)");

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
