import { BadRequestError } from "../controllers/error.controller";

export const checkFileIdProvided = (file) => {
  if (!file) {
    throw new BadRequestError("File wasn't provided");
  }
};
