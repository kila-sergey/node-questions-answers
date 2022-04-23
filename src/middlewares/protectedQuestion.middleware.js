import { sendError, BadRequestError, ForbiddenError } from "../controllers/error.controller";
import { Question } from "../models/question.model";
import { QUESTION_PARAMS } from "../constants/routers.constants";

export const protectedQuestionMiddleware = async (req, res, next) => {
  try {
    const { user } = req;
    const questionId = req.params[QUESTION_PARAMS.QUESTION_ID];

    if (!questionId) {
      throw new BadRequestError("Question id wasn't provided");
    }
    const question = await Question.findById(questionId);

    if (!question) {
      throw new BadRequestError("Question with this id doesn't exist");
    }

    const questionAuthorId = question.author.toString();
    const isAccessAllowed = user.isAdmin || user._id.toString() === questionAuthorId;
    if (!isAccessAllowed) {
      throw new ForbiddenError("Only admin and author has access to this question");
    }

    next();
  } catch (err) {
    sendError(res, err);
  }
};
