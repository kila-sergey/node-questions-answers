import express from "express";
import { StatusCodes } from "http-status-codes";
import { API_PREFIX, RESPONSE_RESULT, ANSWER_PARAMS } from "../constants/routers.constants";
import { VOTING_TYPE } from "../constants/other.constants";
import { getHttpResponse } from "../utils/http.utils";
import { authMiddleware } from "../middlewares/auth.midddleware";
import { protectedAnswerMiddleware } from "../middlewares/protectedAnswer.middleware";
import {
  createAnswer, deleteAnswer, patchAnswer, voteToAnswer,
} from "../controllers/answer.controller";

import { sendError } from "../controllers/error.controller";

export const answerRouter = express.Router();

answerRouter.post(`${API_PREFIX}/answers`, authMiddleware, async (req, res) => {
  try {
    const createdAnswer = await createAnswer(req);

    res
      .status(StatusCodes.CREATED)
      .send(getHttpResponse(createdAnswer, RESPONSE_RESULT.OK));
  } catch (err) {
    sendError(res, err);
  }
});

answerRouter.delete(`${API_PREFIX}/answers/:${ANSWER_PARAMS.ANSWER_ID}`, authMiddleware, protectedAnswerMiddleware, async (req, res) => {
  try {
    await deleteAnswer(req);
    res
      .send(getHttpResponse(null, RESPONSE_RESULT.OK));
  } catch (err) {
    sendError(res, err);
  }
});

answerRouter.patch(
  `${API_PREFIX}/answers/:${ANSWER_PARAMS.ANSWER_ID}`,
  authMiddleware,
  protectedAnswerMiddleware,
  async (req, res) => {
    try {
      const updatedAnswer = await patchAnswer(req);
      res.send(getHttpResponse(updatedAnswer, RESPONSE_RESULT.OK));
    } catch (err) {
      sendError(res, err);
    }
  },
);

answerRouter.post(`${API_PREFIX}/answers/:${ANSWER_PARAMS.ANSWER_ID}/upvote`, authMiddleware, async (req, res) => {
  try {
    const votedAnswer = await voteToAnswer(req, VOTING_TYPE.UP);
    res.send(getHttpResponse(votedAnswer, RESPONSE_RESULT.OK));
  } catch (err) {
    sendError(res, err);
  }
});

answerRouter.post(`${API_PREFIX}/answers/:${ANSWER_PARAMS.ANSWER_ID}/downvote`, authMiddleware, async (req, res) => {
  try {
    const votedAnswer = await voteToAnswer(req, VOTING_TYPE.DOWN);
    res.send(getHttpResponse(votedAnswer, RESPONSE_RESULT.OK));
  } catch (err) {
    sendError(res, err);
  }
});
