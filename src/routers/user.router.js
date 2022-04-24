import express from "express";
import { StatusCodes } from "http-status-codes";
import { RESPONSE_RESULT } from "../constants/routers.constants";
import { getHttpResponse } from "../utils/http.utils";
import { sendError } from "../controllers/error.controller";
import { authMiddleware } from "../middlewares/auth.midddleware";
import {
  userRegister,
  userLogin,
  userLogout,
  userLogoutAll,
} from "../controllers/user.controller";

export const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  try {
    const { userPublicData, token } = await userRegister(req.body);

    res.status(StatusCodes.CREATED).send({
      ...getHttpResponse(userPublicData, RESPONSE_RESULT.OK),
      token,
    });
  } catch (err) {
    sendError(res, err);
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { userPublicData, token } = await userLogin(email, password);
    res.send({ ...getHttpResponse(userPublicData, RESPONSE_RESULT.OK), token });
  } catch (err) {
    sendError(res, err);
  }
});

userRouter.post("/logout", authMiddleware, async (req, res) => {
  try {
    const { user, token } = req;
    await userLogout(user, token);
    res.send(getHttpResponse(null, RESPONSE_RESULT.OK));
  } catch (err) {
    sendError(res, err);
  }
});

userRouter.post("/logoutAll", authMiddleware, async (req, res) => {
  try {
    const { user } = req;
    await userLogoutAll(user);
    res.send(getHttpResponse(null, RESPONSE_RESULT.OK));
  } catch (err) {
    sendError(res, err);
  }
});
