import Question from "../models/question.model";
import { QUESTION_MODEL_KEYS, QUESTION_MODEL_EDITABLE_KEYS } from "../constants/models.constants";
import { getAuthorPopulatedKeys, isAllUpdateParamsAllowed } from "../utils/model.utils";
import { BadRequestError, ForbiddenError } from "./error.controller";
import { QUESTION_PARAMS } from "../constants/routers.constants";
import { VOTING_TYPE } from "../constants/other.constants";

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
  return createdQuestion.getPublicData();
};

export const getAllQuestions = async (req) => {
  const filters = getQuestionFilters(req.query);
  const questions = await Question
    .find({
      ...filters,
    });

  const questonsPromises = questions.map(async (question) => question.getPublicData());
  return Promise.all(questonsPromises);
};

export const getQuestion = async (req) => {
  const questionId = req.params[QUESTION_PARAMS.QUESTION_ID];
  if (!questionId) {
    throw new BadRequestError("Question id wasn't provided");
  }
  const question = await Question
    .findOne({ _id: questionId });

  if (!question) {
    throw new BadRequestError("Question with this id doesn't exist");
  }
  return question.getPublicData();
};

export const deleteQuestion = async (req) => {
  const questionId = req.params[QUESTION_PARAMS.QUESTION_ID];
  if (!questionId) {
    throw new BadRequestError("Question id wasn't provided");
  }

  await Question.deleteOne({ _id: questionId });
};

export const patchQuestion = async (req) => {
  const updateParams = Object.keys(req.body);
  if (updateParams.length === 0
    || !isAllUpdateParamsAllowed(updateParams, QUESTION_MODEL_EDITABLE_KEYS)) {
    throw new BadRequestError("Invalid update params");
  }

  const questionId = req.params[QUESTION_PARAMS.QUESTION_ID];
  const questionToUpdate = await Question.findOne({ _id: questionId });

  if (!questionToUpdate) {
    throw new BadRequestError("Question with this id not found");
  }

  updateParams.forEach((paramKey) => {
    questionToUpdate[paramKey] = req.body[paramKey];
  });

  const updatedQuestion = await questionToUpdate.save();
  return updatedQuestion.getPublicData();
};

export const voteToQuestion = async (req, type) => {
  const userId = req.user._id;
  const questionId = req.params[QUESTION_PARAMS.QUESTION_ID];
  const questionToVote = await Question.findOne({ _id: questionId });
  if (!questionToVote) {
    throw new BadRequestError("Question with this id not found");
  }

  const questionRatingsArray = questionToVote[QUESTION_MODEL_KEYS.RATING];
  const existingUserRating = questionRatingsArray
    .find((rating) => rating.author._id.toString() === userId.toString());

  if (!existingUserRating) {
    questionRatingsArray.push({ author: userId, value: type === VOTING_TYPE.UP ? 1 : -1 });
    const votedQuestion = await questionToVote.save();
    return votedQuestion.getPublicData();
  }

  const { value } = existingUserRating;

  if (type === VOTING_TYPE.UP && value > 0) {
    throw new ForbiddenError("You have already voted up this question");
  }
  if (type === VOTING_TYPE.DOWN && value < 0) {
    throw new ForbiddenError("You have already voted down this question");
  }

  const existingUserRatingIndex = questionRatingsArray.indexOf(existingUserRating);
  questionRatingsArray.set(
    existingUserRatingIndex,
    { author: userId, value: type === VOTING_TYPE.UP ? value + 1 : value - 1 },
  );
  const votedQuestion = await questionToVote.save();

  return votedQuestion.getPublicData();
};
