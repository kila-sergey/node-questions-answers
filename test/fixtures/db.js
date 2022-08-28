import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { User } from "../../src/models/user.model";
import { Question } from "../../src/models/question.model";

export const testUserOneId = new mongoose.Types.ObjectId();
export const testUserOne = {
  _id: testUserOneId,
  name: "TestOne",
  email: "testOneUser@test.com",
  password: "testOnetestOne!",
  isAdmin: true,
  tokens: [
    jwt.sign({ _id: testUserOneId }, process.env.JWT_SECRET),
    jwt.sign({ _id: testUserOneId, email: "testOneUser@test.com" }, process.env.JWT_SECRET),
  ],
};

export const testUserTwoId = new mongoose.Types.ObjectId();
export const testUserTwo = {
  _id: testUserTwoId,
  name: "TestUserTwo",
  email: "testTwoUser@test.com",
  password: "testTwotestTwo!",
  isAdmin: true,
  tokens: [jwt.sign({ _id: testUserTwoId }, process.env.JWT_SECRET)],
};

export const testQuestionOneId = new mongoose.Types.ObjectId();
export const testQuestionOne = {
  _id: testQuestionOneId,
  rating: [],
  title: "Test question 1",
  description: "Test question 1 description",
  tags: [{
    _id: new mongoose.Types.ObjectId(),
    name: "user1",
  }],
  author: testUserOneId,
  answers: [],
};

export const testQuestionTwoId = new mongoose.Types.ObjectId();
export const testQuestionTwo = {
  _id: testQuestionTwoId,
  rating: [],
  title: "Test question 2",
  description: "Test question 2 description",
  tags: [{
    _id: new mongoose.Types.ObjectId(),
    name: "user2",
  }],
  author: testUserTwoId,
  answers: [],
};

export const setupDataBase = async () => {
  await User.deleteMany();
  await Question.deleteMany();

  await new User(testUserOne).save();
  await new User(testUserTwo).save();

  await new Question(testQuestionOne).save();
  await new Question(testQuestionTwo).save();
};
