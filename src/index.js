import express from "express";
import "dotenv/config";
import "./db/mongoose";

import { defaultRouter } from "./routers/default.router";
import { API_PREFIX } from "./constants/routers.constants";
import { getUploadsDirectoryPath } from "./utils/file.utils";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(API_PREFIX, defaultRouter);
app.use("/uploads", express.static(getUploadsDirectoryPath()));

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
