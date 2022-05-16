import mongoose from "mongoose";
import {
  FILE_MODEL_NAME,
} from "../constants/models.constants";
import { fileSchema } from "../schemas/file.schema";

export const File = mongoose.model(FILE_MODEL_NAME, fileSchema);
