import { Router } from "express";
import {
  createWasteSubmission,
  getCollectionHistory,
  verifyWasteSubmission,
} from "../controllers/collectorController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { uploadWasteImage } from "../middleware/uploadMiddleware.js";
import { wasteSubmissionValidation } from "../validations/wasteValidation.js";
import { handleValidation } from "../utils/validators.js";

const router = Router();

router.use(protect, allowRoles("collector", "admin"));
router.post("/submissions", uploadWasteImage, wasteSubmissionValidation, handleValidation, createWasteSubmission);
router.patch("/submissions/:id/verify", verifyWasteSubmission);
router.get("/history", getCollectionHistory);

export default router;
