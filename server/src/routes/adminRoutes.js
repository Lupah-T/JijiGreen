import { Router } from "express";
import {
  createAdminUser,
  createCollectionPoint,
  createReward,
  createSchool,
  getAdminDashboard,
  listAuditLogs,
  listCollectionPoints,
  listCollectors,
  listCollectorApplications,
  listSchools,
  listUsers,
  reviewCollectorApplication,
  updateCollectionPoint,
  updateUserRole,
  getUserDetails,
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import {
  createPrivilegedUserValidation,
  collectionPointValidation,
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
router.get("/collectors", roleMiddleware("super_admin", "operations_admin"), listCollectors);
router.get("/collection-points", roleMiddleware("super_admin", "operations_admin", "school_admin"), listCollectionPoints);
router.post(
  "/collection-points",
  roleMiddleware("super_admin", "operations_admin"),
  collectionPointValidation,
  validateRequest,
  createCollectionPoint
);
router.put(
  "/collection-points/:id",
  roleMiddleware("super_admin", "operations_admin"),
  collectionPointValidation,
  validateRequest,
  updateCollectionPoint
);

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
router.get("/users/:userId/details", roleMiddleware("super_admin"), getUserDetails);
router.get("/schools", listSchools);
router.post("/schools", roleMiddleware("super_admin", "operations_admin"), createSchool);
router.post("/rewards", roleMiddleware("super_admin", "operations_admin"), rewardValidation, handleValidation, createReward);

export default router;
