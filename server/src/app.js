import cors from "cors";
import express from "express";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import collectorRoutes from "./routes/collectorRoutes.js";
import collectionPointRoutes from "./routes/collectionPointRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import rewardsRoutes from "./routes/rewardsRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5174" }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/collector", collectorRoutes);
app.use("/api/collection-points", collectionPointRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/rewards", rewardsRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
