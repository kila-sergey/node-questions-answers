import express from "express";
import multer from "multer";

import { FILE_ALLOWED_MIMETYPES } from "../constants/file.constants";
import { authMiddleware } from "../middlewares/auth.midddleware";
import { sendError } from "../controllers/error.controller";
import { postAvatar } from "../controllers/file.controller";
import { getFileExtensionFromMimetype } from "../utils/file.utils";

export const fileRouter = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    const extension = getFileExtensionFromMimetype(file.mimetype);
    cb(null, `${Date.now()}.${extension}`);
  },
});

const uploadAvatar = multer({
  storage,
  limits: {
    fileSize: 2e6,
  },
  fileFilter(req, file, cb) {
    if (!FILE_ALLOWED_MIMETYPES.includes(file.mimetype)) {
      return cb(new Error("Only .jpg, .jpeg, .png formats are supported"));
    }
    cb(null, true);
  },
}).single("file");

fileRouter.post("/files/avatar/:userId", authMiddleware, uploadAvatar, async (req, res) => {
  try {
    const userAvatarFile = req.file;
    const { userId } = req.params;

    const createdFile = await postAvatar(userAvatarFile, userId);

    res.send(createdFile);
  } catch (err) {
    sendError(res, err);
  }
}, (err, req, res) => {
  sendError(res, err);
});
