import mongoose from "mongoose";

import {
  USER_MODEL_NAME,
} from "../constants/models.constants";
import { userSchema } from "../schemas/user.schema";

export const User = mongoose.model(USER_MODEL_NAME, userSchema);
