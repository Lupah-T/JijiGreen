import { Router } from "express";
import { getStudentDashboard, getStudentHistory, getProfile, updateProfile } from "../controllers/studentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = Router();

router.use(protect, allowRoles("student"));
router.get("/dashboard", getStudentDashboard);
router.get("/history", getStudentHistory);
router.get("/profile", getProfile);
router.put("/profile", updateProfile);

export default router;
