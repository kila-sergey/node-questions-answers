import express from "express";
import "dotenv/config";
import "./db/mongoose";
import path from "path";
import { fileURLToPath } from "url";
import { defaultRouter } from "./routers/default.router";
import { API_PREFIX } from "./constants/routers.constants";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const uploadsDirectoryPath = path.join(dirname, "../uploads");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(API_PREFIX, defaultRouter);
app.use("/uploads", express.static(uploadsDirectoryPath));

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
