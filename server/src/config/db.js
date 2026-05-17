import mongoose from "mongoose";

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is not defined");
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log("MongoDB connected");
  } catch (error) {
    const message =
      error.name === "MongooseServerSelectionError"
        ? "MongoDB connection failed. Check your Atlas Network Access IP allowlist, database username/password, and whether your network allows outbound MongoDB connections."
        : error.message;

    throw new Error(message, { cause: error });
  }
};
