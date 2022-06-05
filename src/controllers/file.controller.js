import { File } from "../models/file.model";
import { checkUserIdProvided } from "../validators/user.validators";
import { checkFileProvided, checkFilesProvided } from "../validators/file.validators";
import { checkQuestionIdProvided } from "../validators/question.validator";
import { checkAnswerIdProvided } from "../validators/answer.validator";
import { getPublicFileName } from "../utils/file.utils";

export const postAvatar = async (avatarFile, userId) => {
  checkUserIdProvided(userId);

  checkFileProvided(avatarFile);

  // To delete previously downloaded avatar
  await File.deleteFiles({ user: userId });

  const file = new File({ name: avatarFile.filename, user: userId });
  const createdFile = await file.save();
  createdFile.name = getPublicFileName(createdFile.name);
  return createdFile;
};

export const postQuestionFiles = async (files, questionId) => {
  checkQuestionIdProvided(questionId);

  checkFilesProvided(files);

  // To delete previously downloaded files
  await File.deleteFiles({ question: questionId });

  const createdFiles = await Promise.all(files.map(async (item) => {
    const file = new File({ name: item.filename, question: questionId });
    const createdFile = await file.save();
    createdFile.name = getPublicFileName(createdFile.name);
    return createdFile;
  }));

  return createdFiles;
};

export const postAnswerFiles = async (files, answerId) => {
  checkAnswerIdProvided(answerId);

  checkFilesProvided(files);

  // To delete previously downloaded files
  await File.deleteFiles({ answer: answerId });

  const createdFiles = await Promise.all(files.map(async (item) => {
    const file = new File({ name: item.filename, answer: answerId });
    const createdFile = await file.save();
    createdFile.name = getPublicFileName(createdFile.name);
    return createdFile;
  }));

  return createdFiles;
};
