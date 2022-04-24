import express from "express";
import { StatusCodes } from "http-status-codes";
import {
  RESPONSE_RESULT,
  QUESTION_PARAMS,
} from "../constants/routers.constants";
import { VOTING_TYPE } from "../constants/other.constants";
import { getHttpResponse } from "../utils/http.utils";
import { authMiddleware } from "../middlewares/auth.midddleware";
import { protectedQuestionMiddleware } from "../middlewares/protectedQuestion.middleware";
import { protectedStrictQuestionMiddleware } from "../middlewares/protectedStrictQuestion.middleware";
import {
  getAllQuestions,
  getQuestion,
  createQuestion,
  deleteQuestion,
  patchQuestion,
  voteToQuestion,
  createQuestionTag,
  deleteQuestionTag,
  updateQuestionTag,
} from "../controllers/question.controllers";
import { sendError } from "../controllers/error.controller";

export const questionRouter = express.Router();

questionRouter.post("/questions", authMiddleware, async (req, res) => {
  try {
    const createdQuestion = await createQuestion(req.user, req.body);
    res
      .status(StatusCodes.CREATED)
      .send(getHttpResponse(createdQuestion, RESPONSE_RESULT.OK));
  } catch (err) {
    sendError(res, err);
  }
});

questionRouter.get("/questions", authMiddleware, async (req, res) => {
  try {
    const questions = await getAllQuestions(req.query);
    res.send(getHttpResponse(questions, RESPONSE_RESULT.OK));
  } catch (err) {
    sendError(res, err);
  }
});

questionRouter.get(
  `/questions/:${QUESTION_PARAMS.QUESTION_ID}`,
  authMiddleware,
  async (req, res) => {
    try {
      const question = await getQuestion(req.params[QUESTION_PARAMS.QUESTION_ID]);
      res.send(getHttpResponse(question, RESPONSE_RESULT.OK));
    } catch (err) {
      sendError(res, err);
    }
  },
);

questionRouter.patch(
  `/questions/:${QUESTION_PARAMS.QUESTION_ID}`,
  authMiddleware,
  protectedQuestionMiddleware,
  async (req, res) => {
    try {
      const updatedQuestion = await patchQuestion(
        req.params[QUESTION_PARAMS.QUESTION_ID],
        req.body,
      );
      res.send(getHttpResponse(updatedQuestion, RESPONSE_RESULT.OK));
    } catch (err) {
      sendError(res, err);
    }
  },
);

questionRouter.delete(
  `/questions/:${QUESTION_PARAMS.QUESTION_ID}`,
  authMiddleware,
  protectedQuestionMiddleware,
  async (req, res) => {
    try {
      await deleteQuestion(req.params[QUESTION_PARAMS.QUESTION_ID]);
      res.send(getHttpResponse(null, RESPONSE_RESULT.OK));
    } catch (err) {
      sendError(res, err);
    }
  },
);

questionRouter.post(
  `/questions/:${QUESTION_PARAMS.QUESTION_ID}/upvote`,
  authMiddleware,
  async (req, res) => {
    try {
      const upVotedQuestion = await voteToQuestion(
        req.user._id,
        req.params[QUESTION_PARAMS.QUESTION_ID],
        VOTING_TYPE.UP,
      );
      res.send(getHttpResponse(upVotedQuestion, RESPONSE_RESULT.OK));
    } catch (err) {
      sendError(res, err);
    }
  },
);

questionRouter.post(
  `/questions/:${QUESTION_PARAMS.QUESTION_ID}/downvote`,
  authMiddleware,
  async (req, res) => {
    try {
      const downVotedQuestion = await voteToQuestion(
        req.user._id,
        req.params[QUESTION_PARAMS.QUESTION_ID],
        VOTING_TYPE.DOWN,
      );
      res.send(getHttpResponse(downVotedQuestion, RESPONSE_RESULT.OK));
    } catch (err) {
      sendError(res, err);
    }
  },
);

questionRouter.post(
  `/questions/:${QUESTION_PARAMS.QUESTION_ID}/tags`,
  authMiddleware,
  protectedStrictQuestionMiddleware,
  async (req, res) => {
    try {
      const question = await createQuestionTag(req.params[QUESTION_PARAMS.QUESTION_ID], req.body);
      res
        .status(StatusCodes.CREATED)
        .send(getHttpResponse(question, RESPONSE_RESULT.OK));
    } catch (err) {
      sendError(res, err);
    }
  },
);

questionRouter.delete(
  `/questions/:${QUESTION_PARAMS.QUESTION_ID}/tags/:${QUESTION_PARAMS.TAG_ID}`,
  authMiddleware,
  protectedStrictQuestionMiddleware,
  async (req, res) => {
    try {
      const question = await deleteQuestionTag(
        req.params[QUESTION_PARAMS.QUESTION_ID],
        req.params[QUESTION_PARAMS.TAG_ID],
      );

      res.send(getHttpResponse(question, RESPONSE_RESULT.OK));
    } catch (err) {
      sendError(res, err);
    }
  },
);

questionRouter.put(
  `/questions/:${QUESTION_PARAMS.QUESTION_ID}/tags/:${QUESTION_PARAMS.TAG_ID}`,
  authMiddleware,
  protectedStrictQuestionMiddleware,
  async (req, res) => {
    try {
      const question = await updateQuestionTag(
        req.params[QUESTION_PARAMS.QUESTION_ID],
        req.params[QUESTION_PARAMS.TAG_ID],
        req.body,
      );

      res.send(getHttpResponse(question, RESPONSE_RESULT.OK));
    } catch (err) {
      sendError(res, err);
    }
  },
);
