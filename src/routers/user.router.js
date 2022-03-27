import express from "express";
import { StatusCodes } from "http-status-codes";
import { API_PREFIX, RESPONSE_RESULT } from "../constants/routers.contsants";
import { getHttpResponse } from "../utils/http.utils";
import { sendError } from "../controllers/error.controller";
import User from "../models/user.model";
import authMiddleware from "../middlewares/auth.midddleware";

const router = express.Router();

router.post(`${API_PREFIX}/register`, async (req, res) => {
  const user = new User(req.body);
  try {
    const token = await user.generateJwtToken();
    const createdUser = await user.save();
    const userPublicDta = await createdUser.getPublicData();

    res.status(StatusCodes.CREATED).send({
      ...getHttpResponse(userPublicDta, RESPONSE_RESULT.OK),
      token,
    });
  } catch (err) {
    sendError(res, err);
  }
});

router.post(`${API_PREFIX}/login`, async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByCredentials(email, password);
    const userPublicData = await user.getPublicData();
    const token = await user.generateJwtToken();
    res.send({ ...getHttpResponse(userPublicData, RESPONSE_RESULT.OK), token });
  } catch (err) {
    sendError(res, err);
  }
});

router.post(`${API_PREFIX}/logout`, authMiddleware, async (req, res) => {
  const { user, token } = req;

  try {
    user.tokens = user.tokens.filter((item) => item !== token);
    await user.save();
    res.send(getHttpResponse(null, RESPONSE_RESULT.OK));
  } catch (err) {
    sendError(res, err);
  }
});

router.post(`${API_PREFIX}/logoutAll`, authMiddleware, async (req, res) => {
  const { user } = req;

  try {
    user.tokens = [];
    await user.save();
    res.send(getHttpResponse(null, RESPONSE_RESULT.OK));
  } catch (err) {
    sendError(res, err);
  }
});

export default router;
