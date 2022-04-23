import { BadRequestError } from "../controllers/error.controller";

export const checkQuestionIdProvided = (questionId) => {
  if (!questionId) {
    throw new BadRequestError("Question id wasn't provided");
  }
};

export const checkQuestionTagNameProvided = (tagName) => {
  if (!tagName) {
    throw new BadRequestError("Tag wasn't provided");
  }
};

export const checkQuestionTagExists = (tag) => {
  if (!tag) {
    throw new BadRequestError("Tag doesn't exist");
  }
};

export const checkQuestionExist = (question) => {
  if (!question) {
    throw new BadRequestError("Question doesn't exist");
  }
};
