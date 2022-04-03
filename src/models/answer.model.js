import mongoose from "mongoose";
import {
  ANSWER_MODEL_NAME,
} from "../constants/models.constants";
import answerSchema from "../schemas/answer.schema";

const Answer = mongoose.model(ANSWER_MODEL_NAME, answerSchema);

export default Answer;
