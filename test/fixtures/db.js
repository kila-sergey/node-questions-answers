import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { User } from "../../src/models/user.model";

export const testUserOneId = new mongoose.Types.ObjectId();
export const testUserOne = {
  _id: testUserOneId,
  name: "TestOne",
  email: "testOneUser@test.com",
  age: "26",
  password: "testOnetestOne!",
  tokens: [jwt.sign({ _id: testUserOneId }, process.env.JWT_SECRET)],
};

export const setupDataBase = async () => {
  await User.deleteMany();
  await new User(testUserOne).save();
};
