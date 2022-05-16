import { BadRequestError } from "../controllers/error.controller";

export const checkUserIdProvided = (userId) => {
  if (!userId) {
    throw new BadRequestError("User id wasn't provided");
  }
};
