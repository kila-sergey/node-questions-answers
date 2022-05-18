import { FILE_MIMETYPE } from "../constants/file.constants";

export const getFileExtensionFromMimetype = (mimetype) => {
  switch (mimetype) {
  case FILE_MIMETYPE.JPEG:
    return "jpg";
  case FILE_MIMETYPE.PNG:
    return "png";
  case FILE_MIMETYPE.JPG:
    return "jpg";
  default:
    return "unknown";
  }
};
