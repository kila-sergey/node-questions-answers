import mongoose from "mongoose";

import { USER_MODEL_NAME } from "../constants/models";
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
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model(USER_MODEL_NAME, userSchema);

export default User;
