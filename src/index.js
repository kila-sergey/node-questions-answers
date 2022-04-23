import express from "express";
import "dotenv/config";
import "./db/mongoose";
import { defaultRouter } from "./routers/default.router";
import { API_PREFIX } from "./constants/routers.constants";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(API_PREFIX, defaultRouter);

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
