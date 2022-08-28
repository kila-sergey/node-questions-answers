import request from "supertest";
import mongoose from "mongoose";

import { app } from "../src/app";
import { setupDataBase, testUserOne, testUserOneId } from "./fixtures/db";
import { User } from "../src/models/user.model";
import { API_PREFIX } from "../src/constants/routers.constants";

beforeEach(setupDataBase);

afterAll(() => {
  mongoose.disconnect();
});

describe("[user register]", () => {
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

describe("[user login]", () => {
  it("[success] Should login already created user", async () => {
    const response = await request(app)
      .post(`${API_PREFIX}/login`)
      .send({
        email: testUserOne.email,
        password: testUserOne.password,
      })
      .expect(200);

    const loggedInUser = await User.findById(response.body.data._id);

    // New token exists in database
    expect(loggedInUser.tokens).toEqual(
      expect.arrayContaining([response.body.token]),
    );
  });

  it("[fail] Should fails with wrong params", async () => {
    await request(app)
      .post(`${API_PREFIX}/login`)
      .send({
        email: "wrongEmail@test.com",
        password: testUserOne.password,
      })
      .expect(401);
  });
});

describe("[user logout]", () => {
  it("[success] Should logout logged in user", async () => {
    await request(app)
      .post(`${API_PREFIX}/logout`)
      .set("Authorization", `Bearer ${testUserOne.tokens[0]}`)
      .expect(200);

    const loggedOutUser = await User.findById(testUserOneId);

    // Token removed from database
    expect(loggedOutUser.tokens).toEqual(
      expect.not.arrayContaining([testUserOne.tokens[0]]),
    );
  });

  it("[fail] Should fails if user unauthorized", async () => {
    await request(app)
      .post(`${API_PREFIX}/logout`)
      .expect(401);
  });
});

describe("[user logout from all the devices]", () => {
  it("[success] Should logout user from all the devices, remove all the tokens", async () => {
    await request(app)
      .post(`${API_PREFIX}/logoutAll`)
      .set("Authorization", `Bearer ${testUserOne.tokens[0]}`)
      .expect(200);

    const loggedOutUser = await User.findById(testUserOneId);

    // All the tokens removed from database
    expect(loggedOutUser.tokens).toEqual([]);
  });
});

describe("[get user information]", () => {
  it("[success] Should return user's information", async () => {
    const response = await request(app)
      .get(`${API_PREFIX}/me`)
      .set("Authorization", `Bearer ${testUserOne.tokens[0]}`)
      .expect(200);

    expect(response.body.data).toMatchObject({
      email: testUserOne.email,
      _id: testUserOne._id,
      name: testUserOne.name,
    });
  });

  it("[fail] Should fails if user unauthorized", async () => {
    await request(app).get(`${API_PREFIX}/me`).send().expect(401);
  });
});

describe("[reset user password]", () => {
  it("[success] Should reset user's password and return new password", async () => {
    const response = await request(app)
      .post(`${API_PREFIX}/password/reset`)
      .send({
        email: testUserOne.email,
      })
      .expect(200);

    expect(response.body.data).toBeTruthy();

    await request(app)
      .post(`${API_PREFIX}/login`)
      .send({
        email: testUserOne.email,
        password: testUserOne.password,
      })
      .expect(401);

    await request(app)
      .post(`${API_PREFIX}/login`)
      .send({
        email: testUserOne.email,
        password: response.body.data,
      })
      .expect(200);
  });
});

describe("[change user password]", () => {
  it("[success] should change user's password", async () => {
    const newPassword = "testOnetestOneNew!";

    await request(app)
      .post(`${API_PREFIX}/password/change`)
      .send({
        oldPassword: testUserOne.password, newPassword, newPasswordCopy: newPassword,
      })
      .set("Authorization", `Bearer ${testUserOne.tokens[0]}`)
      .expect(200);

    await request(app)
      .post(`${API_PREFIX}/login`)
      .send({
        email: testUserOne.email,
        password: testUserOne.password,
      })
      .expect(401);

    await request(app)
      .post(`${API_PREFIX}/login`)
      .send({
        email: testUserOne.email,
        password: newPassword,
      })
      .expect(200);
  });

  it("[fail] should fail if old password don't match", async () => {
    const newPassword = "testOnetestOneNew!";

    await request(app)
      .post(`${API_PREFIX}/password/change`)
      .send({
        oldPassword: "wrongOldPassword", newPassword, newPasswordCopy: newPassword,
      })
      .set("Authorization", `Bearer ${testUserOne.tokens[0]}`)
      .expect(401);
  });

  it("[fail] should fail if newPassword and newPasswordCopy don't match", async () => {
    const newPassword = "testOnetestOneNew!";

    await request(app)
      .post(`${API_PREFIX}/password/change`)
      .send({
        oldPassword: "wrongOldPassword", newPassword, newPasswordCopy: "anotherPassword",
      })
      .set("Authorization", `Bearer ${testUserOne.tokens[0]}`)
      .expect(401);
  });
});
