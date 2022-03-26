import express from "express";
import { StatusCodes } from "http-status-codes";
import { API_PREFIX, RESPONSE_RESULT } from "../constants/routers.contsants";
import { getHttpResponse } from "../utils/http.utils";
import authMiddleware from "../middlewares/auth.midddleware";
import protectedQuestionMiddleware from "../middlewares/protectedQuestionMiddleware";
import {
  getAllQuestions,
  getQuestion,
  createQuestion,
  deleteQuestion,
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

router.get(`${API_PREFIX}/questions/:questionId`, authMiddleware, async (req, res) => {
  try {
    const question = await getQuestion(req);
    res.send(getHttpResponse(question, RESPONSE_RESULT.OK));
  } catch (err) {
    sendError(res, err);
  }
});

router.delete(`${API_PREFIX}/questions/:questionId`, authMiddleware, protectedQuestionMiddleware, async (req, res) => {
  try {
    await deleteQuestion(req);
    res.send(getHttpResponse(null, RESPONSE_RESULT.OK));
  } catch (err) {
    sendError(res, err);
  }
});

export default router;
