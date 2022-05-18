import { File } from "../models/file.model";
import { checkUserIdProvided } from "../validators/user.validators";
import { checkFileProvided } from "../validators/file.validators";

export const postAvatar = async (avatarFile, userId) => {
  checkUserIdProvided(userId);

  checkFileProvided(avatarFile);

  const file = new File({ name: avatarFile.filename, user: userId });
  const createdFile = await file.save();

  return createdFile;
};
