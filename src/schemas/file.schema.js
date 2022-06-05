import mongoose from "mongoose";
import fs from "fs";

import {
  ANSWER_MODEL_NAME,
  QUESTION_MODEL_NAME,
  USER_MODEL_NAME,
} from "../constants/models.constants";
import { getUploadsDirectoryPath } from "../utils/file.utils";

export const fileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId, ref: USER_MODEL_NAME,
  },
  question: {
    type: mongoose.Schema.Types.ObjectId, ref: QUESTION_MODEL_NAME,
  },
  answer: {
    type: mongoose.Schema.Types.ObjectId, ref: ANSWER_MODEL_NAME,
  },
});

fileSchema.statics.deleteFiles = async function (query) {
  if (typeof query !== "object" || !(query instanceof Object)) {
    return;
  }
  const filesToDelete = await this.find(query);

  if (filesToDelete.length > 0) {
    await Promise.all(filesToDelete.map(async (fileToDelete) => {
      await this.deleteOne(query);
      // Delete file from uploads directory
      fs.unlink(`${getUploadsDirectoryPath()}/${fileToDelete.name}`, ((err) => {
        if (err) {
          console.log(`Can't delete file ${fileToDelete.name}`);
        }
      }));
    }));
  }
};
