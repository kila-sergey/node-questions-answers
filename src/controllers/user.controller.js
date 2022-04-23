import { User } from "../models/user.model";

export const userRegister = async (req) => {
  const user = new User(req.body);
  const token = await user.generateJwtToken();
  const createdUser = await user.save();
  const userPublicData = await createdUser.getPublicData();
  return { userPublicData, token };
};

export const userLogin = async (req) => {
  const { email, password } = req.body;
  const user = await User.findByCredentials(email, password);
  const userPublicData = await user.getPublicData();
  const token = await user.generateJwtToken();
  return { userPublicData, token };
};

export const userLogout = async (req) => {
  const { user, token } = req;
  user.tokens = user.tokens.filter((item) => item !== token);
  await user.save();
};

export const userLogoutAll = async (req) => {
  const { user } = req;
  user.tokens = [];
  await user.save();
};
