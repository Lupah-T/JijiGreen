import { Router } from "express";
import { listActiveCollectionPoints } from "../controllers/collectionPointController.js";
import { protect } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = Router();

router.get("/", protect, roleMiddleware("student", "collector", "school_admin", "operations_admin", "super_admin"), listActiveCollectionPoints);

export default router;
