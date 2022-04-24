import { User } from "../models/user.model";

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
  // eslint-disable-next-line no-param-reassign
  user.tokens = user.tokens.filter((item) => item !== token);
  await user.save();
};

export const userLogoutAll = async (user) => {
  // eslint-disable-next-line no-param-reassign
  user.tokens = [];
  await user.save();
};
