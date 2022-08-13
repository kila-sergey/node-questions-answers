import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { User } from "../../src/models/user.model";

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

export const setupDataBase = async () => {
  await User.deleteMany();
  await new User(testUserOne).save();
  await new User(testUserTwo).save();
};
