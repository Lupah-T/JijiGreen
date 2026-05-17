export const normalizeApiError = (error) => {
  if (!error.response) {
    return {
      success: false,
      statusCode: 500,
      message: "Something went wrong",
      data: null,
      errors: [],
      fieldErrors: {},
    };
  }

  const { status, data } = error.response;
  const errors = Array.isArray(data?.errors) ? data.errors : [];
  const statusCode = data?.statusCode || status;

  return {
    success: false,
    statusCode,
    message: statusCode === 500 ? "Something went wrong" : data?.message || (statusCode === 422 ? "Validation failed" : "Something went wrong"),
    data: null,
    errors,
    fieldErrors: errors.reduce((acc, item) => {
      if (item.field) acc[item.field] = item.message;
      return acc;
    }, {}),
  };
};
