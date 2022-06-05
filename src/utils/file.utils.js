import { FILE_MIMETYPE } from "../constants/file.constants";

export const getFileExtensionFromMimetype = (mimetype) => {
  switch (mimetype) {
  case FILE_MIMETYPE.JPEG:
    return "jpg";
  case FILE_MIMETYPE.PNG:
    return "png";
  case FILE_MIMETYPE.JPG:
    return "jpg";
  case FILE_MIMETYPE.WEBP:
    return "webp";
  default:
    return "unknown";
  }
};

export const getFileNameWithoutExtension = (fileName) => fileName.split(".")[0] || fileName;

export const getPublicFileName = (fileName) => `${process.env.PUBLIC_URL}/uploads/${fileName}`;
