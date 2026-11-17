import { Router } from "express";
import { listRewards, myRewards, redeem } from "../controllers/rewardsController.js";
import { protect, optionalProtect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", optionalProtect, listRewards);
router.get("/mine", protect, myRewards);
router.post("/:id/redeem", protect, redeem);

export default router;
