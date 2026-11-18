import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import School from "../models/School.js";
import CollectionPoint from "../models/CollectionPoint.js";
import WasteSubmission from "../models/WasteSubmission.js";
import { awardPoints } from "../services/rewardEngine.js";

dotenv.config();

const accounts = [
  { name: "Demo Student", email: "student@jijigreen.test", password: "Student123", role: "student", age: 14 },
  { name: "Demo Collector", email: "collector@jijigreen.test", password: "Collector123", role: "collector", age: 28 },
  { name: "Demo School Admin", email: "schooladmin@jijigreen.test", password: "SchoolAdmin123", role: "school_admin", age: 35 },
  { name: "Demo Operations Admin", email: "operations@jijigreen.test", password: "Operations123", role: "operations_admin", age: 35 },
  { name: "Demo Super Admin", email: "admin@jijigreen.test", password: "SuperAdmin123", role: "super_admin", age: 35 },
];

try {
  await connectDB();

  const seeded = {};
  for (const account of accounts) {
    let user = await User.findOne({ email: account.email });
    if (!user) {
      user = await User.create({
        ...account,
        isActive: true,
        ageGroup: account.age < 16 ? "child" : "adult",
      });
      console.log(`Created ${account.role}: ${account.email} / ${account.password}`);
    } else {
      user.role = account.role;
      user.isActive = true;
      user.name = account.name;
      user.password = account.password;
      await user.save({ validateBeforeSave: false });
      console.log(`Updated ${account.role}: ${account.email} / ${account.password}`);
    }
    seeded[account.role] = user;
  }

  let school = await School.findOne({ name: "Demo Green Academy" });
  if (!school) {
    school = await School.create({
      name: "Demo Green Academy",
      county: "Nairobi",
      address: "Westlands, Nairobi",
      status: "active",
    });
  }

  seeded.student.school = school._id;
  seeded["school_admin"].school = school._id;
  await Promise.all([
    seeded.student.save({ validateBeforeSave: false }),
    seeded["school_admin"].save({ validateBeforeSave: false }),
  ]);

  let collectionPoint = await CollectionPoint.findOne({ name: "Demo Westlands Recycle Point" });
  if (!collectionPoint) {
    collectionPoint = await CollectionPoint.create({
      name: "Demo Westlands Recycle Point",
      partnerName: "JijiGreen Demo Partner",
      county: "Nairobi",
      address: "Westlands, Nairobi",
      locationNotes: "Main demo collection location",
      coordinates: { lat: -1.2676, lng: 36.8126 },
      acceptedWasteTypes: ["plastic", "paper", "metal", "glass"],
      assignedCollectors: [seeded.collector._id],
      status: "active",
      createdBy: seeded.super_admin._id,
    });
  } else {
    collectionPoint.assignedCollectors = [seeded.collector._id];
    collectionPoint.status = "active";
    await collectionPoint.save();
  }

  const sampleCount = await WasteSubmission.countDocuments({ collectionPoint: collectionPoint._id });
  if (sampleCount === 0) {
    const verified = await WasteSubmission.create({
      student: seeded.student._id,
      collector: seeded.collector._id,
      collectionPoint: collectionPoint._id,
      wasteType: "plastic",
      materialCategory: "plastic",
      weightKg: 2.5,
      status: "verified",
      pointsAwarded: 50,
      verifiedAt: new Date(),
      brandSource: "unknown",
    });
    await awardPoints(seeded.student._id, verified.pointsAwarded);

    await WasteSubmission.create({
      student: seeded.student._id,
      collector: seeded.collector._id,
      collectionPoint: collectionPoint._id,
      wasteType: "paper",
      materialCategory: "paper",
      weightKg: 1.2,
      status: "pending",
      pointsAwarded: 0,
      brandSource: "unknown",
    });
  }

  console.log("\nDemo login accounts:");
  for (const account of accounts) {
    console.log(`${account.role}: ${account.email} / ${account.password}`);
  }
  console.log(`\nStudent ID: ${seeded.student._id}`);
  console.log(`Collection point ID: ${collectionPoint._id}`);
} catch (error) {
  console.error("Demo account seeding failed:", error);
  process.exitCode = 1;
} finally {
  await mongoose.connection.close();
}
