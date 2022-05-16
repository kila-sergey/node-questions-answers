import mongoose from "mongoose";

import {
  ANSWER_MODEL_NAME,
  QUESTION_MODEL_NAME,
  USER_MODEL_NAME,
} from "../constants/models.constants";

export const fileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId, ref: USER_MODEL_NAME,
  },
  question: {
    type: mongoose.Schema.Types.ObjectId, ref: QUESTION_MODEL_NAME,
  },
  answer: {
    type: mongoose.Schema.Types.ObjectId, ref: ANSWER_MODEL_NAME,
  },
});
