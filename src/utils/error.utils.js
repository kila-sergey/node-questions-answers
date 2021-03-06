export const getValidationError = (err) => {
  const messages = {};
  Object.keys(err.errors).forEach((key) => {
    messages[key] = err.errors[key].message;
  });
  return { error: messages };
};

export const getMongoError = (err) => {
  if (err.code === 11000) {
    const messageKey = Object.keys(err.keyValue)[0];
    const message = `Document with this ${messageKey} is already exists`;
    return { err: message };
  }
  return {
    error: err.message,
  };
};

export const getServerError = (err) => ({
  error: err.message,
});

export const getBadRequestError = (err) => {
  const errorMessage = err.message.replace("MulterError", "FilesError");

  return {
    error: errorMessage,
  };
};

export const getAuthError = (err) => ({
  error: err.message,
});

export const getForbiddenError = (err) => ({
  error: err.message,
});

export const getMulterError = (err) => {
  const errorMessage = err.message.replace("MulterError", "FilesError");

  return {
    error: errorMessage,
  };
};
