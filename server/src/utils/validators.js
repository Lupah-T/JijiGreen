import { validationResult } from "express-validator";
import { sendError } from "./apiResponse.js";

export const handleValidation = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return sendError(
      res,
      422,
      "Validation failed",
      errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
      }))
    );
  }

  next();
};
