import { StatusCodes } from "http-status-codes";
import { RESPONSE_RESULT } from "../constants/routers.contsants";
import { getHttpResponse } from "./http.utils";
import { ERROR_NAME } from "../constants/errors.constants";

export class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = ERROR_NAME.BAD_REQUEST_ERROR;
  }
}

export class AuthError extends Error {
  constructor(message) {
    super(message);
    this.name = ERROR_NAME.AUTH_ERROR;
  }
}

export const getValidationError = (err) => {
  const messages = {
  };
  Object.keys(err.errors).forEach((key) => {
    messages[key] = err.errors[key].message;
  });
  return { error: messages };
};

const getMongoError = (err) => {
  if (err.code === 11000) {
    const messageKey = Object.keys(err.keyValue)[0];
    const message = `Document with this ${messageKey} is already exists`;
    return { err: message };
  }
  return {
    error: err.message,
  };
};

const getServerError = (err) => ({
  error: err.message,
});

const getBadRequestError = (err) => ({
  error: err.message,
});

const getAuthError = (err) => ({
  error: err.message,
});

export const sendError = (res, err) => {
  console.log(JSON.stringify(err));
  if (err.name === ERROR_NAME.VALIDATION_ERROR) {
    res.status(StatusCodes.BAD_REQUEST).send(getHttpResponse(
      getValidationError(err),
      RESPONSE_RESULT.FAILED,
    ));
  } else if (err.name === ERROR_NAME.MONGO_SERVER_ERROR) {
    res.status(StatusCodes.BAD_REQUEST).send(getHttpResponse(
      getMongoError(err),
      RESPONSE_RESULT.FAILED,
    ));
  } else if (err.name === ERROR_NAME.BAD_REQUEST_ERROR) {
    res.status(StatusCodes.BAD_REQUEST).send(getHttpResponse(
      getBadRequestError(err),
      RESPONSE_RESULT.FAILED,
    ));
  } else if (err.name === ERROR_NAME.AUTH_ERROR) {
    res.status(StatusCodes.UNAUTHORIZED).send(getHttpResponse(
      getAuthError(err),
      RESPONSE_RESULT.FAILED,
    ));
  } else {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(getHttpResponse(
      getServerError(err),
      RESPONSE_RESULT.FAILED,
    ));
  }
};
