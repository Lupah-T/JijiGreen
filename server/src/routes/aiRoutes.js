import { Router } from "express";
import {
  analyzeWasteImage,
  getCollectionPointRecommendations,
  getDIYRecommendations,
} from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import { uploadAiImage } from "../middleware/aiUploadMiddleware.js";

const router = Router();

router.get(
  "/health",
  protect,
  roleMiddleware("student", "collector", "school_admin", "operations_admin", "super_admin"),
  (_req, res) => {
    res.json({ success: true, message: "AI service is reachable through JijiGreen." });
  }
);

router.post(
  "/analyze",
  protect,
  roleMiddleware("student", "collector", "school_admin", "operations_admin", "super_admin"),
  uploadAiImage,
  analyzeWasteImage
);

router.get(
  "/recommendations/diy",
  protect,
  roleMiddleware("student", "collector", "school_admin", "operations_admin", "super_admin"),
  getDIYRecommendations
);

router.get(
  "/recommendations/collection-points",
  protect,
  roleMiddleware("student", "collector", "school_admin", "operations_admin", "super_admin"),
  getCollectionPointRecommendations
);

export default router;
