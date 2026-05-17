export const sendSuccess = (res, statusCode, message, data = null) =>
  res.status(statusCode).json({
    success: true,
    statusCode,
    message,
    data,
    errors: null,
  });

export const sendError = (res, statusCode, message, errors = null) =>
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    data: null,
    errors,
  });
