import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { File } from "../models/file.model";
import {
  ANSWER_MODEL_NAME,
  QUESTION_MODEL_NAME,
  USER_MODEL_KEYS,
  USER_MODEL_PRIVATE_KEYS,
  PASSWORD_HASH_SALT_ROUNDS,
} from "../constants/models.constants";
import { emailValidator, passwordValidator } from "./validators";
import { BadRequestError, AuthError } from "../controllers/error.controller";
import { getPublicFileName } from "../utils/file.utils";

export const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      validate: emailValidator,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate: passwordValidator,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    answers: [{ type: mongoose.Schema.Types.ObjectId, ref: ANSWER_MODEL_NAME }],
    questions: [
      { type: mongoose.Schema.Types.ObjectId, ref: QUESTION_MODEL_NAME },
    ],
    tokens: [{ type: String, required: true }],
  },
  {
    timestamps: true,
  },
);

async function hashPassword(next) {
  const user = this;
  if (user.isModified(USER_MODEL_KEYS.PASSWORD)) {
    user.password = await bcrypt.hash(user.password, PASSWORD_HASH_SALT_ROUNDS);
  }
  next();
}

userSchema.methods.getPublicData = async function ({ withAvatar }) {
  const user = this;

  const populatedUser = await user
    .populate([{ path: USER_MODEL_KEYS.QUESTIONS }, { path: USER_MODEL_KEYS.ANSWERS }]);

  const userObject = populatedUser.toObject();

  USER_MODEL_PRIVATE_KEYS.forEach((privateKey) => {
    delete userObject[privateKey];
  });

  // Get public data for answers
  const userAnswersPromises = populatedUser[USER_MODEL_KEYS.ANSWERS]
    .map(async (answer) => answer.getPublicData());
  const userAnswersPublicData = await Promise.all(userAnswersPromises);
  userObject[USER_MODEL_KEYS.ANSWERS] = userAnswersPublicData;

  // Get public data for questions
  const userQuestionsPromises = populatedUser[USER_MODEL_KEYS.QUESTIONS]
    .map(async (question) => question.getPublicData());
  const userQuestionsPublicData = await Promise.all(userQuestionsPromises);
  userObject[USER_MODEL_KEYS.QUESTIONS] = userQuestionsPublicData;

  if (withAvatar) {
    const userAvatar = await File.findOne({ user: populatedUser._id });
    userObject.avatar = userAvatar ? getPublicFileName(userAvatar.name) : null;
  }

  return userObject;
};

userSchema.methods.generateJwtToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7 days",
  });
  user[USER_MODEL_KEYS.TOKENS] = [...user[USER_MODEL_KEYS.TOKENS], token];
  await user.save();

  return token;
};

userSchema.statics.findByCredentials = async function (email, password) {
  const user = this;
  if (!email || !password) {
    throw new BadRequestError("Email and password are required");
  }
  const searchedUser = await user.findOne({ email });
  if (!searchedUser) {
    throw new AuthError("User with this email doesn't exist");
  }
  const isPasswordsMatched = await bcrypt.compare(password, searchedUser.password);
  if (!isPasswordsMatched) {
    throw new AuthError("Incorrect password");
  }
  return searchedUser;
};

userSchema.pre("save", hashPassword);
