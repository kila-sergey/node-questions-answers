import { BadRequestError } from "../controllers/error.controller";

export const checkFileProvided = (file) => {
  if (!file) {
    throw new BadRequestError("File wasn't provided");
  }
};

export const checkFilesProvided = (files) => {
  if (!files || files.length < 1) {
    throw new BadRequestError("Files wasn't provided");
  }
};
