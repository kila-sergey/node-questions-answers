import mongoose from "mongoose";
import {
  QUESTION_MODEL_NAME,
  USER_MODEL_NAME,
  USER_MODEL_PRIVATE_KEYS,
  USER_MODEL_KEYS,
  QUESTION_MODEL_KEYS,
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
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: USER_MODEL_NAME,
    },
    tags: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

questionSchema.pre("save", async function () {
  const question = this;
  if (question.isModified(QUESTION_MODEL_KEYS.AUTHOR)) {
    const populateKeys = Object.values(USER_MODEL_KEYS).reduce((acc, item) => {
      if (!USER_MODEL_PRIVATE_KEYS.includes(item)) {
        acc[item] = 1;
      }
      return acc;
    }, {});

    await question.populate(QUESTION_MODEL_KEYS.AUTHOR, populateKeys);
  }
});

const Question = mongoose.model(QUESTION_MODEL_NAME, questionSchema);

export default Question;
