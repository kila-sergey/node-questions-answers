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
  userResetPassword,
  userChangePassword,
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

userRouter.get("/me", authMiddleware, async (req, res) => {
  try {
    const { user } = req;
    const userPublicData = await user.getPublicData({ withAvatar: true });
    res.send(getHttpResponse(userPublicData, RESPONSE_RESULT.OK));
  } catch (err) {
    sendError(res, err);
  }
});

userRouter.post("/password/reset", async (req, res) => {
  try {
    const { email } = req.body;
    const newPassword = await userResetPassword(email);
    res.send(getHttpResponse(newPassword, RESPONSE_RESULT.OK));
  } catch (err) {
    sendError(res, err);
  }
});

userRouter.post("/password/change", authMiddleware, async (req, res) => {
  try {
    const { user } = req;
    const { oldPassword, newPassword, newPasswordCopy } = req.body;
    await userChangePassword(user, oldPassword, newPassword, newPasswordCopy);
    res.send(getHttpResponse(null, RESPONSE_RESULT.OK));
  } catch (err) {
    sendError(res, err);
  }
});
