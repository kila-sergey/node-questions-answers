import { sendError } from "../controllers/error.controller";
import { Question } from "../models/question.model";
import { QUESTION_PARAMS } from "../constants/routers.constants";
import { checkQuestionIdProvided, checkQuestionExist } from "../validators/question.validator";
import { checkAdminOrAuthor } from "../validators/access.validator";

export const protectedQuestionMiddleware = async (req, res, next) => {
  try {
    const { user } = req;
    const questionId = req.params[QUESTION_PARAMS.QUESTION_ID];

    checkQuestionIdProvided(questionId);

    const question = await Question.findById(questionId);

    checkQuestionExist(question);

    const questionAuthorId = question.author.toString();

    checkAdminOrAuthor(user, questionAuthorId);

    next();
  } catch (err) {
    sendError(res, err);
  }
};
