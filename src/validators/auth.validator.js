import { AuthError } from "../controllers/error.controller";

export const checkUserExists = (user) => {
  if (!user) {
    throw new AuthError("Authorization required"); // move to validators
  }
};
