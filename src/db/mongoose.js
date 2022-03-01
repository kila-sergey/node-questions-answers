import mongoose from "mongoose";
import { CONNECTION_URL } from "../constants/db";

mongoose.connect(CONNECTION_URL, {
  autoIndex: true,
});
