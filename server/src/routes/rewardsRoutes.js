import { Router } from "express";
import { listRewards, redeem } from "../controllers/rewardsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", listRewards);
router.post("/:id/redeem", protect, redeem);

export default router;
