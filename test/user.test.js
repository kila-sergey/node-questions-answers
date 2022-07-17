import request from "supertest";
import mongoose from "mongoose";

import { app } from "../src/app";
import { setupDataBase } from "./fixtures/db";
import { User } from "../src/models/user.model";
import { API_PREFIX } from "../src/constants/routers.constants";

beforeEach(setupDataBase);

afterAll(() => {
  mongoose.disconnect();
});

describe("[user sign up]", () => {
  it("[success] Should create new user with encrypted password", async () => {
    const response = await request(app)
      .post(`${API_PREFIX}/register`)
      .send({
        name: "sergey",
        email: "sergey@sergey.com",
        password: "Sergeysergey",
      })
      .expect(201);

    const user = await User.findById(response.body.data._id);

    expect(user).toMatchObject({
      name: "sergey",
      email: "sergey@sergey.com",
    });

    expect(user.password).not.toBe("Sergeysergey");
  });

  it("[fail] Should fails if required params aren't provided", async () => {
    await request(app)
      .post(`${API_PREFIX}/register`)
      .send({
        name: "sergey",
        email: "sergey@sergey.com",
      })
      .expect(400);
  });

  it("[fail] Should fails if password doesn't match the requirements", async () => {
    await request(app)
      .post(`${API_PREFIX}/register`)
      .send({
        name: "sergey",
        email: "sergey@sergey.com",
        password: "small",
      })
      .expect(400);
  });
});
