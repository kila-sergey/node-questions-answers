import mongoose from "mongoose";

export const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
});
