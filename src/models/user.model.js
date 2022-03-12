import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
  USER_MODEL_NAME,
  ANSWER_MODEL_NAME,
  QUESTION_MODEL_NAME,
  USER_MODEL_KEYS,
  USER_MODEL_PRIVATE_KEYS,
  PASSWORD_HASH_SALT_ROUNDS,
} from "../constants/models.constants";
import { emailValidator, passwordValidator } from "./validators";

const userSchema = new mongoose.Schema(
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

userSchema.methods.getPublicData = async function () {
  const user = this;
  const userObject = user.toObject();

  USER_MODEL_PRIVATE_KEYS.forEach((privateKey) => {
    delete userObject[privateKey];
  });

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

userSchema.pre("save", async function () {
  const user = this;
  if (user.isModified(USER_MODEL_KEYS.PASSWORD)) {
    user.password = await bcrypt.hash(user.password, PASSWORD_HASH_SALT_ROUNDS);
  }
});

const User = mongoose.model(USER_MODEL_NAME, userSchema);

export default User;
