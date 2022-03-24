import mongoose from "mongoose";
import {
  ANSWER_MODEL_NAME,
  USER_MODEL_NAME,
  QUESTION_MODEL_NAME,
} from "../constants/models.constants";

const answerSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
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

const Answer = mongoose.model(ANSWER_MODEL_NAME, answerSchema);

export default Answer;
