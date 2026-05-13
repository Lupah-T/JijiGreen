import { Router } from "express";
import { login, me, register } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { loginValidation, registerValidation } from "../validations/authValidation.js";
import { handleValidation } from "../utils/validators.js";

const router = Router();

router.post("/register", registerValidation, handleValidation, register);
router.post("/login", loginValidation, handleValidation, login);
router.get("/me", protect, me);

export default router;
