import { Router } from "express";
import {
  createAdminUser,
  createReward,
  createSchool,
  getAdminDashboard,
  listAuditLogs,
  listCollectorApplications,
  listSchools,
  listUsers,
  reviewCollectorApplication,
  updateUserRole,
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import {
  createPrivilegedUserValidation,
  reviewCollectorApplicationValidation,
  validateRequest,
  roleUpdateValidation,
} from "../middleware/validation.js";
import { rewardValidation } from "../validations/rewardValidation.js";
import { handleValidation } from "../utils/validators.js";

const router = Router();

router.use(protect);
router.post(
  "/create-user",
  roleMiddleware("super_admin"),
  createPrivilegedUserValidation,
  validateRequest,
  createAdminUser
);

router.get(
  "/collector-applications",
  roleMiddleware("super_admin", "operations_admin"),
  listCollectorApplications
);
router.patch(
  "/collector-applications/:id/review",
  roleMiddleware("super_admin", "operations_admin"),
  reviewCollectorApplicationValidation,
  validateRequest,
  reviewCollectorApplication
);
router.get("/audit-logs", roleMiddleware("super_admin"), listAuditLogs);

router.patch(
  "/users/:userId/role",
  roleMiddleware("super_admin"),
  roleUpdateValidation,
  validateRequest,
  updateUserRole
);

router.use(roleMiddleware("super_admin", "operations_admin", "school_admin"));
router.get("/dashboard", getAdminDashboard);
router.get("/users", roleMiddleware("super_admin", "operations_admin"), listUsers);
router.get("/schools", listSchools);
router.post("/schools", roleMiddleware("super_admin", "operations_admin"), createSchool);
router.post("/rewards", roleMiddleware("super_admin", "operations_admin"), rewardValidation, handleValidation, createReward);

export default router;
