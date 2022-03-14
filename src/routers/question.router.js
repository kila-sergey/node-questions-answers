import express from "express";
import { StatusCodes } from "http-status-codes";
import { API_PREFIX, RESPONSE_RESULT } from "../constants/routers.contsants";
import Question from "../models/question.model";
import { sendError } from "../utils/error.utils";
import { getHttpResponse } from "../utils/http.utils";
import authMiddleware from "../middlewares/auth.midddleware";

const router = express.Router();

router.post(`${API_PREFIX}/questions`, authMiddleware, async (req, res) => {
  const author = await req.user;
  const question = new Question({ ...req.body, author: author._id });

  try {
    const createdQuestion = await question.save();
    res
      .status(StatusCodes.CREATED)
      .send(getHttpResponse(createdQuestion, RESPONSE_RESULT.OK));
  } catch (err) {
    sendError(res, err);
  }
});

router.get(`${API_PREFIX}/questions`, authMiddleware, async (req, res) => {
  try {
    const questions = await Question.find();
    res.send(getHttpResponse(questions, RESPONSE_RESULT.OK));
  } catch (err) {
    sendError(res, err);
  }
});

export default router;
