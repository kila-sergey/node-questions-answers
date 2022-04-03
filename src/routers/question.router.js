import express from "express";
import { StatusCodes } from "http-status-codes";
import { API_PREFIX, RESPONSE_RESULT, QUESTION_PARAMS } from "../constants/routers.constants";
import { VOTING_TYPE } from "../constants/other.constants";
import { getHttpResponse } from "../utils/http.utils";
import authMiddleware from "../middlewares/auth.midddleware";
import protectedQuestionMiddleware from "../middlewares/protectedQuestion.middleware";
import {
  getAllQuestions,
  getQuestion,
  createQuestion,
  deleteQuestion,
  patchQuestion,
  voteToQuestion,
} from "../controllers/question.controllers";
import { sendError } from "../controllers/error.controller";

const router = express.Router();

router.post(`${API_PREFIX}/questions`, authMiddleware, async (req, res) => {
  try {
    const createdQuestion = await createQuestion(req);
    res
      .status(StatusCodes.CREATED)
      .send(getHttpResponse(createdQuestion, RESPONSE_RESULT.OK));
  } catch (err) {
    sendError(res, err);
  }
});

router.get(`${API_PREFIX}/questions`, authMiddleware, async (req, res) => {
  try {
    const questions = await getAllQuestions(req);
    res.send(getHttpResponse(questions, RESPONSE_RESULT.OK));
  } catch (err) {
    sendError(res, err);
  }
});

router.get(
  `${API_PREFIX}/questions/:${QUESTION_PARAMS.QUESTION_ID}`,
  authMiddleware,
  async (req, res) => {
    try {
      const question = await getQuestion(req);
      res.send(getHttpResponse(question, RESPONSE_RESULT.OK));
    } catch (err) {
      sendError(res, err);
    }
  },
);

router.patch(
  `${API_PREFIX}/questions/:${QUESTION_PARAMS.QUESTION_ID}`,
  authMiddleware,
  protectedQuestionMiddleware,
  async (req, res) => {
    try {
      const updatedQuestion = await patchQuestion(req);
      res.send(getHttpResponse(updatedQuestion, RESPONSE_RESULT.OK));
    } catch (err) {
      sendError(res, err);
    }
  },
);

router.delete(
  `${API_PREFIX}/questions/:${QUESTION_PARAMS.QUESTION_ID}`,
  authMiddleware,
  protectedQuestionMiddleware,
  async (req, res) => {
    try {
      await deleteQuestion(req);
      res.send(getHttpResponse(null, RESPONSE_RESULT.OK));
    } catch (err) {
      sendError(res, err);
    }
  },
);

router.post(`${API_PREFIX}/questions/:${QUESTION_PARAMS.QUESTION_ID}/upvote`, authMiddleware, async (req, res) => {
  try {
    const upVotedQuestion = await voteToQuestion(req, VOTING_TYPE.UP);
    res.send(getHttpResponse(upVotedQuestion, RESPONSE_RESULT.OK));
  } catch (err) {
    sendError(res, err);
  }
});

router.post(`${API_PREFIX}/questions/:${QUESTION_PARAMS.QUESTION_ID}/downvote`, authMiddleware, async (req, res) => {
  try {
    const downVotedQuestion = await voteToQuestion(req, VOTING_TYPE.DOWN);
    res.send(getHttpResponse(downVotedQuestion, RESPONSE_RESULT.OK));
  } catch (err) {
    sendError(res, err);
  }
});
export default router;
