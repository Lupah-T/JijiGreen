import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const { SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD } = process.env;

if (!SUPER_ADMIN_EMAIL || !SUPER_ADMIN_PASSWORD) {
  console.error("SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD must be set");
  process.exit(1);
}

try {
  await connectDB();

  const existingSuperAdmin = await User.findOne({ role: "super_admin" });
  if (existingSuperAdmin) {
    console.log("Super admin already exists. Seed skipped.");
    process.exit(0);
  }

  const superAdmin = await User.create({
    name: "JijiGreen Super Admin",
    email: SUPER_ADMIN_EMAIL,
    password: SUPER_ADMIN_PASSWORD,
    role: "super_admin",
  });

  console.log(`Super admin created: ${superAdmin.email}`);
  process.exit(0);
} catch (error) {
  console.error("Failed to seed super admin", error);
  process.exit(1);
} finally {
  await mongoose.connection.close();
}
