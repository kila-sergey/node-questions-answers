import multer from "multer";

import { FILE_ALLOWED_MIMETYPES } from "../constants/file.constants";
import { getFileExtensionFromMimetype, getFileNameWithoutExtension } from "../utils/file.utils";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    const originalNameWithoutExtension = getFileNameWithoutExtension(file.originalname);
    const extension = getFileExtensionFromMimetype(file.mimetype);
    cb(null, `${originalNameWithoutExtension}_${Date.now()}.${extension}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 2e6,
  },
  fileFilter(req, file, cb) {
    if (!FILE_ALLOWED_MIMETYPES.includes(file.mimetype)) {
      return cb(new Error(`Only ${FILE_ALLOWED_MIMETYPES.join(",")} formats are supported`));
    }
    cb(null, true);
  },
});

export const uploadAvatarMiddleware = upload.single("file");
export const uploadFilesMiddleware = upload.array("files", 4);
