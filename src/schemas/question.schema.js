import mongoose from "mongoose";

import {
  USER_MODEL_NAME,
  ANSWER_MODEL_NAME,
  QUESTION_MODEL_KEYS,
} from "../constants/models.constants";
import { BadRequestError } from "../controllers/error.controller";
import { getAuthorPopulatedKeys } from "../utils/model.utils";
import ratingSchema from "./rating.schema";
import tagSchema from "./tag.schema";

const questionSchema = new mongoose.Schema(
  {
    rating: [ratingSchema],
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    tags: [tagSchema],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: USER_MODEL_NAME,
    },
    answers: [{ type: mongoose.Schema.Types.ObjectId, ref: ANSWER_MODEL_NAME }],
  },
  {
    timestamps: true,
  },
);

questionSchema.statics.findQuestionById = async function (id) {
  const question = await this
    .findOne({ _id: id });

  if (!question) {
    throw new BadRequestError("Question with this id doesn't exist");
  }

  return question;
};

questionSchema.methods.getPublicData = async function () {
  const question = this;
  const populatedQuestion = await question.populate([
    { path: QUESTION_MODEL_KEYS.ANSWERS },
    { path: QUESTION_MODEL_KEYS.AUTHOR, select: getAuthorPopulatedKeys() }]);

  const questionObject = populatedQuestion.toObject();

  questionObject[QUESTION_MODEL_KEYS.RATING] = questionObject[QUESTION_MODEL_KEYS.RATING]
    .reduce((acc, item) => acc + item.value, 0);

  // Get public data for answers
  const questionsAnswersPromises = populatedQuestion[QUESTION_MODEL_KEYS.ANSWERS]
    .map(async (answer) => answer.getPublicData());
  const questionsAnswers = await Promise.all(questionsAnswersPromises);
  questionObject[QUESTION_MODEL_KEYS.ANSWERS] = questionsAnswers;

  return questionObject;
};

questionSchema.methods.getTag = async function (tagId) {
  const question = this;
  const questionTag = question[QUESTION_MODEL_KEYS.TAGS].find((tag) => tag.id === tagId);
  if (!questionTag) {
    throw new BadRequestError("Tag with this id not found");
  }
  return questionTag;
};

export default questionSchema;
