import mongoose from "mongoose";

import {
  QUESTION_MODEL_NAME,
} from "../constants/models.constants";
import questionSchema from "../schemas/question.schema";

const Question = mongoose.model(QUESTION_MODEL_NAME, questionSchema);

export default Question;
