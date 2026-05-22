import { Router } from "express";
import { getLeaderboard, rebuildLeaderboard } from "../controllers/leaderboardController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = Router();

router.get("/", getLeaderboard);
router.post("/refresh", protect, allowRoles("operations_admin", "super_admin"), rebuildLeaderboard);

export default router;
