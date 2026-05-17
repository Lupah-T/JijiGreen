import { body, validationResult } from "express-validator";
import { sendError } from "../utils/apiResponse.js";

export const validateRequest = (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return sendError(
      res,
      422,
      "Validation failed",
      result.array().map((error) => ({
        field: error.path,
        message: error.msg,
      }))
    );
  }

  return next();
};

export const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .bail()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .bail()
    .matches(/[A-Z]/)
    .withMessage("Password must include at least one uppercase letter")
    .bail()
    .matches(/[a-z]/)
    .withMessage("Password must include at least one lowercase letter")
    .bail()
    .matches(/\d/)
    .withMessage("Password must include at least one number"),
];

export const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];
