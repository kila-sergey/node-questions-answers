import mongoose from "mongoose";
import { getAuthorPopulatedKeys } from "../utils/model.utils";

import {
  QUESTION_MODEL_NAME,
  USER_MODEL_NAME,
  ANSWER_MODEL_NAME,
  QUESTION_MODEL_KEYS,
} from "../constants/models.constants";
import ratingSchema from "./ratingSchema";

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
    tags: [
      {
        type: String,
      },
    ],
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

function autoPopulate(next) {
  this.populate(QUESTION_MODEL_KEYS.ANSWERS)
    .populate(QUESTION_MODEL_KEYS.AUTHOR, getAuthorPopulatedKeys());
  next();
}

questionSchema
  .pre("findOne", autoPopulate)
  .pre("find", autoPopulate);

questionSchema.methods.getPublicData = async function () {
  const question = this;
  const questionObject = question.toObject();

  questionObject[QUESTION_MODEL_KEYS.RATING] = questionObject[QUESTION_MODEL_KEYS.RATING]
    .reduce((acc, item) => acc + item.value, 0);

  return questionObject;
};

const Question = mongoose.model(QUESTION_MODEL_NAME, questionSchema);

export default Question;
