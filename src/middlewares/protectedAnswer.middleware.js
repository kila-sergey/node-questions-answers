import { ANSWER_PARAMS } from "../constants/routers.constants";
import {
  sendError,
} from "../controllers/error.controller";
import { Answer } from "../models/answer.model";
import { checkAnswerIdProvided, checkAnswerExists } from "../validators/answer.validator";
import { checkAdminOrAuthor } from "../validators/access.validator";

export const protectedAnswerMiddleware = async (req, res, next) => {
  try {
    const { user } = req;
    const answerId = req.params[ANSWER_PARAMS.ANSWER_ID];

    checkAnswerIdProvided(answerId);

    const answer = await Answer.findById(answerId);

    checkAnswerExists(answer);

    const answerAuthorId = answer.author.toString();

    checkAdminOrAuthor(user, answerAuthorId);

    next();
  } catch (err) {
    sendError(res, err);
  }
};
