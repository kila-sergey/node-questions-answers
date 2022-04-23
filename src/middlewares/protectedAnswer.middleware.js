import { ANSWER_PARAMS } from "../constants/routers.constants";
import {
  sendError,
  BadRequestError,
  ForbiddenError,
} from "../controllers/error.controller";
import { Answer } from "../models/answer.model";

export const protectedAnswerMiddleware = async (req, res, next) => {
  try {
    const { user } = req;
    const answerId = req.params[ANSWER_PARAMS.ANSWER_ID];

    if (!answerId) {
      throw new BadRequestError("Answer id wasn't provided");
    }
    const answer = await Answer.findById(answerId);

    if (!answer) {
      throw new BadRequestError("Answer with this id doesn't exist");
    }

    const answerAuthorId = answer.author.toString();
    const isAccessAllowed = user.isAdmin || user._id.toString() === answerAuthorId;
    if (!isAccessAllowed) {
      throw new ForbiddenError(
        "Only admin and author has access to this answer",
      );
    }

    next();
  } catch (err) {
    sendError(res, err);
  }
};
