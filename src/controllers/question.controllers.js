import { Question } from "../models/question.model";
import { QUESTION_MODEL_KEYS, QUESTION_MODEL_EDITABLE_KEYS, USER_MODEL_KEYS } from "../constants/models.constants";
import { QUESTION_PARAMS } from "../constants/routers.constants";
import { VOTING_TYPE } from "../constants/other.constants";
import { checkQuestionIdProvided, checkQuestionTagNameProvided } from "../validators/question.validator";
import { checkIfVoted, checkUpdateParamsValid } from "../validators/other.validator";

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

  author[USER_MODEL_KEYS.QUESTIONS].push(createdQuestion._id);
  await author.save();

  return createdQuestion.getPublicData();
};

export const getAllQuestions = async (req) => {
  const filters = getQuestionFilters(req.query);
  const questions = await Question
    .find({
      ...filters,
    });

  const questionsPromises = questions.map(async (question) => question.getPublicData());
  return Promise.all(questionsPromises);
};

export const getQuestion = async (req) => {
  const questionId = req.params[QUESTION_PARAMS.QUESTION_ID];
  const question = await Question
    .findQuestionById(questionId);
  return question.getPublicData();
};

export const deleteQuestion = async (req) => {
  const questionId = req.params[QUESTION_PARAMS.QUESTION_ID];

  checkQuestionIdProvided(questionId);

  await Question.deleteOne({ _id: questionId });
};

export const patchQuestion = async (req) => {
  const updateParams = Object.keys(req.body);

  checkUpdateParamsValid(updateParams, QUESTION_MODEL_EDITABLE_KEYS);

  const questionId = req.params[QUESTION_PARAMS.QUESTION_ID];
  const questionToUpdate = await Question.findQuestionById(questionId);

  updateParams.forEach((paramKey) => {
    questionToUpdate[paramKey] = req.body[paramKey];
  });

  const updatedQuestion = await questionToUpdate.save();
  return updatedQuestion.getPublicData();
};

export const voteToQuestion = async (req, type) => {
  const userId = req.user._id;
  const questionId = req.params[QUESTION_PARAMS.QUESTION_ID];
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

export const createQuestionTag = async (req) => {
  const questionId = req.params[QUESTION_PARAMS.QUESTION_ID];
  const question = await Question
    .findQuestionById(questionId);

  const { name } = req.body;

  checkQuestionTagNameProvided(name);

  question[QUESTION_MODEL_KEYS.TAGS].push(req.body);
  const newQuestion = await question.save();
  return newQuestion.getPublicData();
};

export const deleteQuestionTag = async (req) => {
  const questionId = req.params[QUESTION_PARAMS.QUESTION_ID];
  const tagId = req.params[QUESTION_PARAMS.TAG_ID];
  const question = await Question
    .findQuestionById(questionId);

  const questionTag = await question.getTag(tagId);

  question[QUESTION_MODEL_KEYS.TAGS].id(questionTag._id).remove();
  const newQuestion = await question.save();

  return newQuestion;
};

export const updateQuestionTag = async (req) => {
  const questionId = req.params[QUESTION_PARAMS.QUESTION_ID];
  const tagId = req.params[QUESTION_PARAMS.TAG_ID];
  const question = await Question
    .findQuestionById(questionId);

  const questionTag = await question.getTag(tagId);
  const questionTagIndex = question[QUESTION_MODEL_KEYS.TAGS].indexOf(questionTag);

  question[QUESTION_MODEL_KEYS.TAGS].set(
    questionTagIndex,
    {
      _id: questionTag._id,
      ...req.body,
    },
  );

  const newQuestion = await question.save();
  return newQuestion;
};
