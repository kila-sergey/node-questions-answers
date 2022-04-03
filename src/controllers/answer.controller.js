import Answer from "../models/answer.model";
import Question from "../models/question.model";
import { BadRequestError, ForbiddenError } from "./error.controller";
import { ANSWER_MODEL_EDITABLE_KEYS, ANSWER_MODEL_KEYS } from "../constants/models.constants";
import { ANSWER_PARAMS } from "../constants/routers.contsants";
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

export const upVoteToAnswer = async (req) => {
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
    answerRatingsArray.push({ author: userId, value: 1 });
    const votedAnswer = await answerToVote.save();

    return votedAnswer.getPublicData();
  }

  const { value } = existingUserRating;
  if (value > 0) {
    throw new ForbiddenError("You have already voted up this answer");
  }

  const existingUserRatingIndex = answerRatingsArray.indexOf(existingUserRating);
  answerRatingsArray.set(existingUserRatingIndex, { author: userId, value: value + 1 });
  const votedAnswer = await answerToVote.save();

  return votedAnswer.getPublicData();
};

export const downVoteToAnswer = async (req) => {
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
    answerRatingsArray.push({ author: userId, value: -1 });
    const votedAnswer = await answerToVote.save();

    return votedAnswer.getPublicData();
  }

  const { value } = existingUserRating;
  if (value < 0) {
    throw new ForbiddenError("You have already voted down this answer");
  }

  const existingUserRatingIndex = answerRatingsArray.indexOf(existingUserRating);
  answerRatingsArray.set(existingUserRatingIndex, { author: userId, value: value - 1 });
  const votedAnswer = await answerToVote.save();

  return votedAnswer.getPublicData();
};
