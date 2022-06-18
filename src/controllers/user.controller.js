import generator from "generate-password";

import { User } from "../models/user.model";
import { checkIsPasswordCorrect, checkPasswordsMatched } from "../validators/user.validators";

export const userRegister = async (userBody) => {
  const user = new User(userBody);
  const token = await user.generateJwtToken();
  const createdUser = await user.save();
  const userPublicData = await createdUser.getPublicData();
  return { userPublicData, token };
};

export const userLogin = async (email, password) => {
  const user = await User.findByCredentials(email, password);
  const userPublicData = await user.getPublicData();
  const token = await user.generateJwtToken();
  return { userPublicData, token };
};

export const userLogout = async (user, token) => {
  user.tokens = user.tokens.filter((item) => item !== token);
  await user.save();
};

export const userLogoutAll = async (user) => {
  user.tokens = [];
  await user.save();
};

export const userResetPassword = async (email) => {
  const user = await User.findByEmail(email);
  const randomPassword = generator.generate({
    length: 8,
    numbers: true,
  });
  user.password = randomPassword;

  await user.save();

  return randomPassword;
};

export const userChangePassword = async (user, oldPassword, newPassword, newPasswordCopy) => {
  checkIsPasswordCorrect(oldPassword, user.password);
  checkPasswordsMatched(newPassword, newPasswordCopy);
  user.password = newPassword;
  await user.save();
};
