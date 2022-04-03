import mongoose from "mongoose";

import {
  USER_MODEL_NAME,
} from "../constants/models.constants";

import userSchema from "../schemas/user.schema";

const User = mongoose.model(USER_MODEL_NAME, userSchema);

export default User;
