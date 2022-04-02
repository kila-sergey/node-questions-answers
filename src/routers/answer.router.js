import express from "express";
import { StatusCodes } from "http-status-codes";
import { API_PREFIX, RESPONSE_RESULT } from "../constants/routers.contsants";
import { getHttpResponse } from "../utils/http.utils";
import authMiddleware from "../middlewares/auth.midddleware";
import protectedAnswerMiddleware from "../middlewares/protectedAnswer.middleware";
import { createAnswer, deleteAnswer, patchAnswer } from "../controllers/answer.controller";

import { sendError } from "../controllers/error.controller";

const router = express.Router();

router.post(`${API_PREFIX}/answers`, authMiddleware, async (req, res) => {
  try {
    const createdAnswer = await createAnswer(req);

    res
      .status(StatusCodes.CREATED)
      .send(getHttpResponse(createdAnswer, RESPONSE_RESULT.OK));
  } catch (err) {
    sendError(res, err);
  }
});

router.delete(`${API_PREFIX}/answers/:answerId`, authMiddleware, protectedAnswerMiddleware, async (req, res) => {
  try {
    await deleteAnswer(req);
    res
      .send(getHttpResponse(null, RESPONSE_RESULT.OK));
  } catch (err) {
    sendError(res, err);
  }
});

router.patch(
  `${API_PREFIX}/answers/:answerId`,
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

export default router;
