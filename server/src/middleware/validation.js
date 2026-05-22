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

export const createPrivilegedUserValidation = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ min: 2 }),
  body("email").trim().isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must include at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must include at least one lowercase letter")
    .matches(/\d/)
    .withMessage("Password must include at least one number"),
  body("role")
    .isIn(["collector", "school_admin", "operations_admin"])
    .withMessage("Role must be collector, school_admin, or operations_admin"),
];

export const collectorApplicationValidation = [
  body("fullName").trim().notEmpty().withMessage("Full name is required").isLength({ min: 2 }),
  body("phone").trim().notEmpty().withMessage("Phone number is required"),
  body("county").trim().notEmpty().withMessage("County is required"),
  body("collectionPointName").trim().notEmpty().withMessage("Collection point name is required"),
  body("location").trim().notEmpty().withMessage("Location is required"),
  body("nationalId").trim().notEmpty().withMessage("National ID or passport is required"),
  body("documentUrl").optional({ checkFalsy: true }).trim().isURL().withMessage("Document URL must be valid"),
  body("reason").trim().notEmpty().withMessage("Reason is required").isLength({ min: 20, max: 1000 }),
];

export const reviewCollectorApplicationValidation = [
  body("status").isIn(["approved", "rejected"]).withMessage("Status must be approved or rejected"),
  body("moderationNotes").optional({ checkFalsy: true }).trim().isLength({ max: 1000 }),
];

export const roleUpdateValidation = [
  body("role")
    .isIn(["collector", "school_admin", "operations_admin", "student", "super_admin"])
    .withMessage("Role must be one of collector, school_admin, operations_admin, student, super_admin"),
];
