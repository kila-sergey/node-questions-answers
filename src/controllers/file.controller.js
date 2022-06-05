import { File } from "../models/file.model";
import { checkUserIdProvided } from "../validators/user.validators";
import { checkFileProvided, checkFilesProvided } from "../validators/file.validators";
import { checkQuestionIdProvided } from "../validators/question.validator";
import { getPublicFileName } from "../utils/file.utils";

export const postAvatar = async (avatarFile, userId) => {
  checkUserIdProvided(userId);

  checkFileProvided(avatarFile);

  await File.deleteOne({ user: userId });

  const file = new File({ name: avatarFile.filename, user: userId });
  const createdFile = await file.save();
  createdFile.name = getPublicFileName(createdFile.name);
  return createdFile;
};

export const postQuestionFiles = async (files, questionId) => {
  checkQuestionIdProvided(questionId);

  checkFilesProvided(files);

  await File.deleteMany({ question: questionId });

  const createdFiles = await Promise.all(files.map(async (item) => {
    const file = new File({ name: item.filename, question: questionId });
    const createdFile = await file.save();
    createdFile.name = getPublicFileName(createdFile.name);
    return createdFile;
  }));

  return createdFiles;
};
