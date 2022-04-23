import mongoose from "mongoose";
import {
  USER_MODEL_NAME,
} from "../constants/models.constants";

export const ratingSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: USER_MODEL_NAME,
    required: true,
  },
  value: {
    type: Number,
    required: true,
    min: -1,
    max: 1,
  },
});
