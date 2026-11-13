import { Router } from "express";
import {
  applyToBecomeCollector,
  createWasteSubmission,
  getCollectionHistory,
  getMyCollectorApplication,
  getPendingSubmissions,
  verifyWasteSubmission,
} from "../controllers/collectorController.js";
import { protect } from "../middleware/authMiddleware.js";
import { rateLimit } from "../middleware/rateLimitMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import { uploadWasteImage } from "../middleware/uploadMiddleware.js";
import { collectorApplicationValidation, validateRequest } from "../middleware/validation.js";
import { wasteSubmissionValidation } from "../validations/wasteValidation.js";
import { handleValidation } from "../utils/validators.js";

const router = Router();

router.post(
  "/apply",
  protect,
  roleMiddleware("student"),
  rateLimit({ windowMs: 60 * 60 * 1000, max: 3, keyPrefix: "collector-apply" }),
  collectorApplicationValidation,
  validateRequest,
  applyToBecomeCollector
);
router.get("/application", protect, roleMiddleware("student", "collector"), getMyCollectorApplication);

router.use(protect, roleMiddleware("collector", "operations_admin", "super_admin"));
router.get("/pending", getPendingSubmissions);
router.post("/submissions", uploadWasteImage, wasteSubmissionValidation, handleValidation, createWasteSubmission);
router.patch("/submissions/:id/verify", verifyWasteSubmission);
router.get("/history", getCollectionHistory);

export default router;
