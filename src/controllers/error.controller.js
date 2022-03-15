import { StatusCodes } from "http-status-codes";
import { getHttpResponse } from "../utils/http.utils";
import { RESPONSE_RESULT } from "../constants/routers.contsants";
import {
  getValidationError,
  getMongoError,
  getBadRequestError,
  getAuthError,
  getServerError,
} from "../utils/error.utils";
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

export const sendError = (res, err) => {
  console.log(JSON.stringify(err));
  if (err.name === ERROR_NAME.VALIDATION_ERROR) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send(getHttpResponse(getValidationError(err), RESPONSE_RESULT.FAILED));
  } else if (err.name === ERROR_NAME.MONGO_SERVER_ERROR) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send(getHttpResponse(getMongoError(err), RESPONSE_RESULT.FAILED));
  } else if (err.name === ERROR_NAME.BAD_REQUEST_ERROR) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send(getHttpResponse(getBadRequestError(err), RESPONSE_RESULT.FAILED));
  } else if (err.name === ERROR_NAME.AUTH_ERROR) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .send(getHttpResponse(getAuthError(err), RESPONSE_RESULT.FAILED));
  } else {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(getHttpResponse(getServerError(err), RESPONSE_RESULT.FAILED));
  }
};
