import express from "express";
import { API_PREFIX } from "./constants/routers.constants";
import { defaultRouter } from "./routers/default.router";
import { getUploadsDirectoryPath } from "./utils/file.utils";

import "./db/mongoose";

export const app = express();

app.use(express.json());
app.use(API_PREFIX, defaultRouter);
app.use("/uploads", express.static(getUploadsDirectoryPath()));
