import { Question } from "../models/question.model";
import { QUESTION_MODEL_KEYS, QUESTION_MODEL_EDITABLE_KEYS, USER_MODEL_KEYS } from "../constants/models.constants";
import { VOTING_TYPE } from "../constants/other.constants";
import { checkQuestionTagNameProvided, checkQuestionExist } from "../validators/question.validator";
import { checkIfVoted, checkUpdateParamsValid } from "../validators/other.validator";

const getQuestionFilters = (query) => {
  const filters = {};
  if (query.tags) {
    const tagsArray = query[QUESTION_MODEL_KEYS.TAGS].split(",");
    filters["tags.name"] = tagsArray;
  }
  return filters;
};

export const createQuestion = async (user, questionBody) => {
  const author = user;
  const question = new Question({ ...questionBody, author: author._id });
  const createdQuestion = await question.save();

  author[USER_MODEL_KEYS.QUESTIONS].push(createdQuestion._id);
  await author.save();

  return createdQuestion.getPublicData();
};

export const getAllQuestions = async (query) => {
  const filters = getQuestionFilters(query);
  const questions = await Question
    .find({
      ...filters,
    });

  const questionsPromises = questions.map(async (question) => question.getPublicData());
  return Promise.all(questionsPromises);
};

export const getQuestion = async (questionId) => {
  const question = await Question
    .findQuestionById(questionId);

  return question.getPublicData();
};

export const deleteQuestion = async (questionId) => {
  const question = await Question
    .findQuestionById(questionId);

  checkQuestionExist(question);

  await Question.deleteOne({ _id: questionId });
};

export const patchQuestion = async (questionId, questionBody) => {
  const updateParams = Object.keys(questionBody);

  checkUpdateParamsValid(updateParams, QUESTION_MODEL_EDITABLE_KEYS);

  const questionToUpdate = await Question.findQuestionById(questionId);

  updateParams.forEach((paramKey) => {
    questionToUpdate[paramKey] = questionBody[paramKey];
  });

  const updatedQuestion = await questionToUpdate.save();
  return updatedQuestion.getPublicData();
};

export const voteToQuestion = async (userId, questionId, type) => {
  const questionToVote = await Question.findQuestionById(questionId);

  const questionRatingsArray = questionToVote[QUESTION_MODEL_KEYS.RATING];
  const existingUserRating = questionRatingsArray
    .find((rating) => rating.author._id.toString() === userId.toString());

  if (!existingUserRating) {
    questionRatingsArray.push({ author: userId, value: type === VOTING_TYPE.UP ? 1 : -1 });
    const votedQuestion = await questionToVote.save();
    return votedQuestion.getPublicData();
  }

  const { value } = existingUserRating;

  checkIfVoted(type, value);

  const existingUserRatingIndex = questionRatingsArray.indexOf(existingUserRating);
  questionRatingsArray.set(
    existingUserRatingIndex,
    { author: userId, value: type === VOTING_TYPE.UP ? value + 1 : value - 1 },
  );
  const votedQuestion = await questionToVote.save();

  return votedQuestion.getPublicData();
};

export const createQuestionTag = async (questionId, tagBody) => {
  const question = await Question
    .findQuestionById(questionId);

  const { name } = tagBody;

  checkQuestionTagNameProvided(name);

  question[QUESTION_MODEL_KEYS.TAGS].push(tagBody);
  const newQuestion = await question.save();
  return newQuestion.getPublicData();
};

export const deleteQuestionTag = async (questionId, tagId) => {
  const question = await Question
    .findQuestionById(questionId);

  const questionTag = await question.getTag(tagId);

  question[QUESTION_MODEL_KEYS.TAGS].id(questionTag._id).remove();
  const newQuestion = await question.save();

  return newQuestion;
};

export const updateQuestionTag = async (questionId, tagId, tagBody) => {
  const question = await Question
    .findQuestionById(questionId);

  const questionTag = await question.getTag(tagId);
  const questionTagIndex = question[QUESTION_MODEL_KEYS.TAGS].indexOf(questionTag);

  question[QUESTION_MODEL_KEYS.TAGS].set(
    questionTagIndex,
    {
      _id: questionTag._id,
      ...tagBody,
    },
  );

  const newQuestion = await question.save();
  return newQuestion;
};
