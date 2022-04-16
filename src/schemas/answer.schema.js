import mongoose from "mongoose";
import {
  USER_MODEL_NAME,
  QUESTION_MODEL_NAME,
  ANSWER_MODEL_KEYS,
} from "../constants/models.constants";
import { getAuthorPopulatedKeys } from "../utils/model.utils";
import ratingSchema from "./rating.schema";

const answerSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    rating: [ratingSchema],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: USER_MODEL_NAME,
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: QUESTION_MODEL_NAME,
    },
  },
  {
    timestamps: true,
  },
);

function autoPopulate(next) {
  this.populate(ANSWER_MODEL_KEYS.AUTHOR, getAuthorPopulatedKeys());
  next();
}

answerSchema
  .pre("findOne", autoPopulate)
  .pre("find", autoPopulate);

answerSchema.methods.getPublicData = async function () {
  const answer = this;
  const answerObject = answer.toObject();
  answerObject[ANSWER_MODEL_KEYS.RATING] = answerObject[
    ANSWER_MODEL_KEYS.RATING
  ].reduce((acc, item) => acc + item.value, 0);

  return answerObject;
};

export default answerSchema;
