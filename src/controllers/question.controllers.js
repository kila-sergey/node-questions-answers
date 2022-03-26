import Question from "../models/question.model";
import { QUESTION_MODEL_KEYS } from "../constants/models.constants";
import { getAuthorPopulatedKeys } from "../utils/model.utils";
import { BadRequestError } from "./error.controller";

const getQuestionFilters = (query) => {
  const filters = {};
  if (query.tags) {
    filters.tags = query.tags.split(",");
  }
  return filters;
};

export const createQuestion = async (req) => {
  const author = await req.user;
  const question = new Question({ ...req.body, author: author._id });
  const createdQuestion = await question.save();
  return createdQuestion;
};

export const getAllQuestions = async (req) => {
  const filters = getQuestionFilters(req.query);
  const questions = await Question
    .find(filters)
    .populate(QUESTION_MODEL_KEYS.ANSWERS)
    .populate(QUESTION_MODEL_KEYS.AUTHOR, getAuthorPopulatedKeys());

  return questions;
};

export const getQuestion = async (req) => {
  const { questionId } = req.params;
  if (!questionId) {
    throw new BadRequestError("questionId wasn't provided");
  }
  const question = await Question
    .findById(questionId)
    .populate(QUESTION_MODEL_KEYS.ANSWERS)
    .populate(QUESTION_MODEL_KEYS.AUTHOR, getAuthorPopulatedKeys());

  if (!question) {
    throw new BadRequestError("Question with this id doesn't exist");
  }
  return question;
};

export const deleteQuestion = async (req) => {
  const { questionId } = req.params;
  if (!questionId) {
    throw new BadRequestError("questionId wasn't provided");
  }

  await Question.deleteOne({ _id: questionId });
};
