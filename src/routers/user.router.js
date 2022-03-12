import express from "express";
import {
  StatusCodes,
} from "http-status-codes";
import { RESPONSE_RESULT } from "../constants/routers.contsants";
import { sendError } from "../utils/error.utils";
import { getHttpResponse } from "../utils/http.utils";
import User from "../models/user.model";

const router = express.Router();

router.post("/signup", async (req, res) => {
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

export default router;
