import express from "express";
import multer from "multer";

import { File } from "../models/file.model";
import { authMiddleware } from "../middlewares/auth.midddleware";
import { sendError } from "../controllers/error.controller";
import { checkUserIdProvided } from "../validators/user.validators";
import { checkFileIdProvided } from "../validators/file.validators";

// TODO:MAKE VALIDATION ON FILES
// TODO:REFACTOR USING CONTROLLERS
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}.jpg`);
  },
});

export const fileRouter = express.Router();

const uploadAvatar = multer({ storage }).single("file");

fileRouter.post("/files/avatar/:userId", authMiddleware, uploadAvatar, async (req, res) => {
  try {
    const userAvatarFile = req.file;
    const { userId } = req.params;

    checkUserIdProvided(userId);

    checkFileIdProvided(userAvatarFile);

    const file = new File({ name: userAvatarFile.filename, user: userId });
    const createdFile = await file.save();
    res.send(createdFile);
  } catch (err) {
    sendError(res, err);
  }
}, (err, req, res, next) => {
  sendError(res, err);
});
