import { Answer } from "../models/answer.model";
import { Question } from "../models/question.model";
import { BadRequestError } from "./error.controller";
import {
  ANSWER_MODEL_EDITABLE_KEYS, ANSWER_MODEL_KEYS, USER_MODEL_KEYS, QUESTION_MODEL_KEYS,
} from "../constants/models.constants";
import { VOTING_TYPE } from "../constants/other.constants";
import { checkAnswerIdProvided, checkAnswerExists } from "../validators/answer.validator";
import { checkIfVoted, checkUpdateParamsValid } from "../validators/other.validator";

export const createAnswer = async (user, answerBody) => {
  const author = user;
  const relatedQuestion = await Question.findOne({ _id: answerBody.questionId });

  if (!relatedQuestion) {
    throw new BadRequestError("Question with this id doesn't exist");
  }

  const answer = new Answer({ ...answerBody, author: author._id });
  const createdAnswer = await answer.save();

  relatedQuestion[QUESTION_MODEL_KEYS.ANSWERS].push(createdAnswer._id);
  await relatedQuestion.save();

  author[USER_MODEL_KEYS.ANSWERS].push(createdAnswer._id);
  await author.save();

  return createdAnswer.getPublicData();
};

export const deleteAnswer = async (answerId) => {
  checkAnswerIdProvided(answerId);

  await Answer.deleteOne({ _id: answerId });
};

export const patchAnswer = async (answerId, answerBody) => {
  const updateParams = Object.keys(answerBody);

  checkUpdateParamsValid(updateParams, ANSWER_MODEL_EDITABLE_KEYS);

  const answerToUpdate = await Answer.findOne({ _id: answerId });

  checkAnswerExists(answerToUpdate);

  updateParams.forEach((paramKey) => {
    answerToUpdate[paramKey] = answerBody[paramKey];
  });

  const updatedAnswer = await answerToUpdate.save();
  return updatedAnswer.getPublicData();
};

export const voteToAnswer = async (userId, answerId, votingType) => {
  const answerToVote = await Answer.findOne({ _id: answerId });

  checkAnswerExists(answerToVote);

  const answerRatingsArray = answerToVote[ANSWER_MODEL_KEYS.RATING];
  const existingUserRating = answerRatingsArray
    .find((rating) => rating.author._id.toString() === userId.toString());

  if (!existingUserRating) {
    answerRatingsArray.push({ author: userId, value: votingType === VOTING_TYPE.UP ? 1 : -1 });
    const votedAnswer = await answerToVote.save();

    return votedAnswer.getPublicData();
  }

  const userRatingValue = existingUserRating.value;

  checkIfVoted(votingType, userRatingValue);

  const existingUserRatingIndex = answerRatingsArray.indexOf(existingUserRating);
  answerRatingsArray.set(
    existingUserRatingIndex,
    {
      author: userId,
      value: votingType === VOTING_TYPE.UP
        ? userRatingValue + 1 : userRatingValue - 1,
    },
  );
  const votedAnswer = await answerToVote.save();

  return votedAnswer.getPublicData();
};
