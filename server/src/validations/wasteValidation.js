import { body } from "express-validator";

export const wasteSubmissionValidation = [
  body("student").isMongoId().withMessage("Student is required"),
  body("collectionPoint").isMongoId().withMessage("Collection point is required"),
  body("wasteType").trim().notEmpty().withMessage("Waste type is required"),
  body("weightKg").isFloat({ min: 0.1 }).withMessage("Weight must be greater than 0"),
];
