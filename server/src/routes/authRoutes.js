import { Router } from "express";
import { login, me, register, forgotPassword, resetPassword } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { loginValidation, registerValidation, validateRequest } from "../middleware/validation.js";

const router = Router();

router.post("/register", registerValidation, validateRequest, register);
router.post("/login", loginValidation, validateRequest, login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/me", protect, me);

export default router;
