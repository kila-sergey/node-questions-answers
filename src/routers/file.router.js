import express from "express";

import { authMiddleware } from "../middlewares/auth.midddleware";
import { uploadAvatarMiddleware, uploadFilesMiddleware } from "../middlewares/files.middelware";
import { BadRequestError, sendError } from "../controllers/error.controller";
import { postAvatar, postQuestionFiles, postAnswerFiles } from "../controllers/file.controller";

export const fileRouter = express.Router();

fileRouter.post(
  "/files/avatar/:userId",
  authMiddleware,
  async (req, res) => {
    uploadAvatarMiddleware(req, res, async (err) => {
      try {
        if (err) {
          throw new BadRequestError(err);
        }

        const userAvatarFile = req.file;
        const { userId } = req.params;

        const createdFile = await postAvatar(userAvatarFile, userId);

        res.send(createdFile);
      } catch (error) {
        sendError(res, error);
      }
    });
  },
);

fileRouter.post("/files/question/:questionId", authMiddleware, async (req, res) => {
  uploadFilesMiddleware(req, res, async (err) => {
    try {
      if (err) {
        throw new BadRequestError(err);
      }

      const questionFiles = req.files;
      const { questionId } = req.params;
      const createdFiles = await postQuestionFiles(questionFiles, questionId);
      res.send(createdFiles);
    } catch (error) {
      sendError(res, error);
    }
  });
});

fileRouter.post("/files/answer/:answerId", authMiddleware, async (req, res) => {
  uploadFilesMiddleware(req, res, async (err) => {
    try {
      if (err) {
        throw new BadRequestError(err);
      }

      const answerFiles = req.files;
      const { answerId } = req.params;
      const createdFiles = await postAnswerFiles(answerFiles, answerId);
      res.send(createdFiles);
    } catch (error) {
      sendError(res, error);
    }
  });
});
