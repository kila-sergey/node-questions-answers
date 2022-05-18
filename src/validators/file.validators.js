import { BadRequestError } from "../controllers/error.controller";

export const checkFileProvided = (file) => {
  if (!file) {
    throw new BadRequestError("File wasn't provided");
  }
};
