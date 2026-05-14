import { body } from "express-validator";

export const rewardValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("pointsCost").isInt({ min: 1 }).withMessage("Points cost must be positive"),
  body("stock").optional().isInt({ min: 0 }).withMessage("Stock cannot be negative"),
];
