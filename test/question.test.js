import request from "supertest";
import mongoose from "mongoose";

import { Question } from "../src/models/question.model";
import { app } from "../src/app";
import { setupDataBase, testUserOne, testUserOneId } from "./fixtures/db";
import { API_PREFIX } from "../src/constants/routers.constants";

beforeEach(setupDataBase);

afterAll(() => {
  mongoose.disconnect();
});

describe("[create question]", () => {
  it("[success] should create question related to the user", async () => {
    const response = await request(app)
      .post(`${API_PREFIX}/questions`)
      .set("Authorization", `Bearer ${testUserOne.tokens[0]}`)
      .send({
        title: "Test question title",
        author: testUserOneId,
      })
      .expect(201);

    const createdQuestion = await Question.findById(response.body.data._id);

    expect(createdQuestion).not.toBeNull();
    expect(createdQuestion.author).toEqual(testUserOneId);
  });
});
