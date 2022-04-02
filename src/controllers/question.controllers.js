import Question from "../models/question.model";
import { QUESTION_MODEL_KEYS, QUESTION_MODEL_EDITABLE_KEYS } from "../constants/models.constants";
import { getAuthorPopulatedKeys, isAllUpdateParamsAllowed } from "../utils/model.utils";
import { BadRequestError, ForbiddenError } from "./error.controller";
import { QUESTION_PARAMS } from "../constants/routers.contsants";

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
    })
    .populate(QUESTION_MODEL_KEYS.ANSWERS)
    .populate(QUESTION_MODEL_KEYS.AUTHOR, getAuthorPopulatedKeys());

  const questonsPromises = questions.map(async (question) => question.getPublicData());
  return Promise.all(questonsPromises);
};

export const getQuestion = async (req) => {
  const questionId = req.params[QUESTION_PARAMS.QUESTION_ID];
  if (!questionId) {
    throw new BadRequestError("Question id wasn't provided");
  }
  const question = await Question
    .findOne({ _id: questionId })
    .populate(QUESTION_MODEL_KEYS.ANSWERS)
    .populate(QUESTION_MODEL_KEYS.AUTHOR, getAuthorPopulatedKeys());

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

export const upVoteToQuestion = async (req) => {
  const userId = req.user._id;
  const questionId = req.params[QUESTION_PARAMS.QUESTION_ID];
  const questionToUpVote = await Question.findOne({ _id: questionId });
  if (!questionToUpVote) {
    throw new BadRequestError("Question with this id not found");
  }

  const questionRatingsArray = questionToUpVote[QUESTION_MODEL_KEYS.RATING];
  const existingUserRating = questionRatingsArray
    .find((rating) => rating.author._id.toString() === userId.toString());

  if (!existingUserRating) {
    questionRatingsArray.push({ author: userId, value: 1 });
    const upVotedQuestion = await questionToUpVote.save();
    return upVotedQuestion.getPublicData();
  }

  const { value } = existingUserRating;

  if (value > 0) {
    throw new ForbiddenError("You have already voted up this question");
  }

  const existingUserRatingIndex = questionRatingsArray.indexOf(existingUserRating);
  questionRatingsArray.set(existingUserRatingIndex, { author: userId, value: value + 1 });
  const upVotedQuestion = await questionToUpVote.save();

  return upVotedQuestion.getPublicData();
};

export const downVoteToQuestion = async (req) => {
  const userId = req.user._id;
  const questionId = req.params[QUESTION_PARAMS.QUESTION_ID];
  const questionToDownVote = await Question.findOne({ _id: questionId });
  if (!questionToDownVote) {
    throw new BadRequestError("Question with this id not found");
  }

  const questionRatingsArray = questionToDownVote[QUESTION_MODEL_KEYS.RATING];
  const existingUserRating = questionRatingsArray
    .find((rating) => rating.author._id.toString() === userId.toString());

  if (!existingUserRating) {
    questionRatingsArray.push({ author: userId, value: -1 });
    const downVotedQuestion = await questionToDownVote.save();
    return downVotedQuestion.getPublicData();
  }

  const { value } = existingUserRating;
  if (value < 0) {
    throw new ForbiddenError("You have already voted down this question");
  }

  const existingUserRatingIndexIndex = questionRatingsArray.indexOf(existingUserRating);
  questionRatingsArray.set(existingUserRatingIndexIndex, { author: userId, value: value - 1 });
  const downVotedQuestion = await questionToDownVote.save();

  return downVotedQuestion.getPublicData();
};
