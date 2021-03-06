import mongoose from "mongoose";

import { File } from "../models/file.model";
import {
  USER_MODEL_NAME,
  QUESTION_MODEL_NAME,
  ANSWER_MODEL_KEYS,
} from "../constants/models.constants";
import { getAuthorPopulatedKeys } from "../utils/model.utils";
import { ratingSchema } from "./rating.schema";
import { getPublicFileName } from "../utils/file.utils";

export const answerSchema = new mongoose.Schema(
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

answerSchema.methods.getPublicData = async function () {
  const answer = this;
  const populatedAnswer = await answer.populate({
    path: ANSWER_MODEL_KEYS.AUTHOR,
    select: getAuthorPopulatedKeys(),
  });

  const answerObject = populatedAnswer.toObject();
  answerObject[ANSWER_MODEL_KEYS.RATING] = answerObject[
    ANSWER_MODEL_KEYS.RATING
  ].reduce((acc, item) => acc + item.value, 0);

  // Add files to response
  const answersFiles = await File.find({ answer: answerObject._id });
  answerObject.files = answersFiles.map((item) => getPublicFileName(item.name));

  return answerObject;
};
