import { body } from "express-validator";

export const wasteSubmissionValidation = [
  body("wasteType").trim().notEmpty().withMessage("Waste type is required"),
  body("weightKg").isFloat({ min: 0.1 }).withMessage("Weight must be greater than 0"),
];
