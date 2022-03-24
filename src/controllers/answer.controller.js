import Answer from "../models/answer.model";
import Question from "../models/question.model";
import { BadRequestError } from "./error.controller";

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
