import { AuthError } from "../controllers/error.controller";

export const checkUserExists = (user) => {
  if (!user) {
    throw new AuthError("Authorization required"); // move to validators
  }
};

export const checkTokenProvided = (req) => {
  if (!req.headers.authorization) {
    throw new AuthError("Authorization token wasn't provided");
  }
};
