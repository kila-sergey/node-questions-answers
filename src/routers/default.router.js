import { Router } from "express";
import { userRouter } from "./user.router";
import { questionRouter } from "./question.router";
import { answerRouter } from "./answer.router";
import { fileRouter } from "./file.router";

export const defaultRouter = Router();

defaultRouter.use(userRouter);
defaultRouter.use(questionRouter);
defaultRouter.use(answerRouter);
defaultRouter.use(fileRouter);
