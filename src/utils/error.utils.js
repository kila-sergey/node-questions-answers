import { StatusCodes } from "http-status-codes";
import { RESPONSE_RESULT } from "../constants/routers.contsants";
import { getHttpResponse } from "./http.utils";

export const getValidationError = (err) => {
  const messages = {
  };
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

export const sendError = (res, err) => {
  console.log(JSON.stringify(err));
  if (err.name === "ValidationError") {
    res.status(StatusCodes.BAD_REQUEST).send(getHttpResponse(
      getValidationError(err),
      RESPONSE_RESULT.FAILED,
    ));
  } else if (err.name === "MongoServerError") {
    res.status(StatusCodes.BAD_REQUEST).send(getHttpResponse(
      getMongoError(err),
      RESPONSE_RESULT.FAILED,
    ));
  } else {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(getHttpResponse(
      getServerError(err),
      RESPONSE_RESULT.FAILED,
    ));
  }
};
