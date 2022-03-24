import mongoose from "mongoose";
import {
  QUESTION_MODEL_NAME,
  USER_MODEL_NAME,
  ANSWER_MODEL_NAME,
} from "../constants/models.constants";

const questionSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      default: 0,
    },
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

const Question = mongoose.model(QUESTION_MODEL_NAME, questionSchema);

export default Question;
