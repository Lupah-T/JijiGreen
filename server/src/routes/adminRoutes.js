import { Router } from "express";
import {
  createReward,
  createSchool,
  getAdminDashboard,
  listSchools,
  listUsers,
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { rewardValidation } from "../validations/rewardValidation.js";
import { handleValidation } from "../utils/validators.js";

const router = Router();

router.use(protect, allowRoles("admin"));
router.get("/dashboard", getAdminDashboard);
router.get("/users", listUsers);
router.get("/schools", listSchools);
router.post("/schools", createSchool);
router.post("/rewards", rewardValidation, handleValidation, createReward);

export default router;
