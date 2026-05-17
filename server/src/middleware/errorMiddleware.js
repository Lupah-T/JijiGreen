import { sendError } from "../utils/apiResponse.js";

export const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (err, _req, res, _next) => {
  if (err.stack) {
    console.error(err.stack);
  }

  if (err.code === 11000) {
    return sendError(res, 409, err.keyPattern?.email ? "User already exists" : "Duplicate resource");
  }

  if (err.name === "ValidationError") {
    return sendError(
      res,
      422,
      "Validation failed",
      Object.entries(err.errors).map(([field, error]) => ({
        field,
        message: error.message,
      }))
    );
  }

  if (err.name === "CastError") {
    return sendError(res, 500, "Something went wrong");
  }

  const statusCode = err.statusCode && err.statusCode >= 400 && err.statusCode < 600 ? err.statusCode : 500;
  const message = statusCode === 500 ? "Something went wrong" : err.message;

  return sendError(res, statusCode, message);
};
