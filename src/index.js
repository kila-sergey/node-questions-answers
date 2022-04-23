import express from "express";
import "dotenv/config";
import "./db/mongoose";
import { userRouter } from "./routers/user.router";
import { questionRouter } from "./routers/question.router";
import { answerRouter } from "./routers/answer.router";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);
app.use(questionRouter);
app.use(answerRouter);

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
