import Answer from "../models/answer.model";
import Question from "../models/question.model";
import { BadRequestError } from "./error.controller";
import { ANSWER_MODEL_EDITABLE_KEYS } from "../constants/models.constants";
import { isAllUpdateParamsAllowed } from "../utils/model.utils";

export const createAnswer = async (req) => {
  const author = req.user;
  const relatedQuestion = await Question.findOne({ _id: req.body.questionId });

  if (!relatedQuestion) {
    throw new BadRequestError("Question with this id doesn't exist");
  }

  const answer = new Answer({ ...req.body, author: author._id });
  const createdAnswer = await answer.save();

  relatedQuestion.answers = [...relatedQuestion.answers, createdAnswer._id];

  await relatedQuestion.save();

  return createdAnswer;
};

export const deleteAnswer = async (req) => {
  const { answerId } = req.params;
  if (!answerId) {
    throw new BadRequestError("Answer id wasn't provided");
  }

  await Answer.deleteOne({ _id: answerId });
};

export const patchAnswer = async (req) => {
  const updateParams = Object.keys(req.body);
  if (updateParams.length === 0
    || !isAllUpdateParamsAllowed(updateParams, ANSWER_MODEL_EDITABLE_KEYS)) {
    throw new BadRequestError("Invalid update params");
  }

  const { answerId } = req.params;
  const answerToUpdate = await Answer.findOne({ _id: answerId });
  if (!answerToUpdate) {
    throw new BadRequestError("Question with this id not found");
  }

  updateParams.forEach((paramKey) => {
    answerToUpdate[paramKey] = req.body[paramKey];
  });

  const updatedAnswer = await answerToUpdate.save();
  return updatedAnswer;
};
