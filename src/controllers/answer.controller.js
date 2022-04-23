import { Answer } from "../models/answer.model";
import { Question } from "../models/question.model";
import { BadRequestError, ForbiddenError } from "./error.controller";
import {
  ANSWER_MODEL_EDITABLE_KEYS, ANSWER_MODEL_KEYS, USER_MODEL_KEYS, QUESTION_MODEL_KEYS,
} from "../constants/models.constants";
import { ANSWER_PARAMS } from "../constants/routers.constants";
import { VOTING_TYPE } from "../constants/other.constants";
import { isAllUpdateParamsAllowed } from "../utils/model.utils";

export const createAnswer = async (req) => {
  const author = req.user;
  const relatedQuestion = await Question.findOne({ _id: req.body.questionId });
  if (!relatedQuestion) {
    throw new BadRequestError("Question with this id doesn't exist");
  }

  const answer = new Answer({ ...req.body, author: author._id });
  const createdAnswer = await answer.save();

  relatedQuestion[QUESTION_MODEL_KEYS.ANSWERS].push(createdAnswer._id);
  await relatedQuestion.save();

  author[USER_MODEL_KEYS.ANSWERS].push(createdAnswer._id);
  await author.save();

  return createdAnswer.getPublicData();
};

export const deleteAnswer = async (req) => {
  const answerId = req.params[ANSWER_PARAMS.ANSWER_ID];
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

  const answerId = req.params[ANSWER_PARAMS.ANSWER_ID];
  const answerToUpdate = await Answer.findOne({ _id: answerId });
  if (!answerToUpdate) {
    throw new BadRequestError("Question with this id not found");
  }

  updateParams.forEach((paramKey) => {
    answerToUpdate[paramKey] = req.body[paramKey];
  });

  const updatedAnswer = await answerToUpdate.save();
  return updatedAnswer.getPublicData();
};

export const voteToAnswer = async (req, type) => {
  const userId = req.user._id;
  const answerId = req.params[ANSWER_PARAMS.ANSWER_ID];
  const answerToVote = await Answer.findOne({ _id: answerId });
  if (!answerToVote) {
    throw new BadRequestError("Answer with this id not found");
  }

  const answerRatingsArray = answerToVote[ANSWER_MODEL_KEYS.RATING];
  const existingUserRating = answerRatingsArray
    .find((rating) => rating.author._id.toString() === userId.toString());

  if (!existingUserRating) {
    answerRatingsArray.push({ author: userId, value: type === VOTING_TYPE.UP ? 1 : -1 });
    const votedAnswer = await answerToVote.save();

    return votedAnswer.getPublicData();
  }

  const { value } = existingUserRating;
  if (type === VOTING_TYPE.UP && value > 0) {
    throw new ForbiddenError("You have already voted up this answer");
  }
  if (type === VOTING_TYPE.DOWN && value < 0) {
    throw new ForbiddenError("You have already voted down this answer");
  }

  const existingUserRatingIndex = answerRatingsArray.indexOf(existingUserRating);
  answerRatingsArray.set(
    existingUserRatingIndex,
    { author: userId, value: type === VOTING_TYPE.UP ? value + 1 : value - 1 },
  );
  const votedAnswer = await answerToVote.save();

  return votedAnswer.getPublicData();
};
