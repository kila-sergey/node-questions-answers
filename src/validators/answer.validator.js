import { BadRequestError } from "../controllers/error.controller";

export const checkAnswerIdProvided = (answerId) => {
  if (!answerId) {
    throw new BadRequestError("Answer id wasn't provided");
  }
};

export const checkAnswerExists = (answer) => {
  if (!answer) {
    throw new BadRequestError("Answer doesn't exist");
  }
};
