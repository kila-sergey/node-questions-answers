import bcrypt from "bcrypt";
import { BadRequestError, AuthError } from "../controllers/error.controller";

export const checkUserIdProvided = (userId) => {
  if (!userId) {
    throw new BadRequestError("User id wasn't provided");
  }
};

export const checkPasswordsMatched = (newPassword, newPasswordCopy) => {
  if (newPassword !== newPasswordCopy) {
    throw new BadRequestError("Passwords should match");
  }
};

export const checkIsPasswordCorrect = (passwordString, hashedPassword) => {
  const isPasswordCorrect = bcrypt.compareSync(
    passwordString,
    hashedPassword,
  );

  if (!isPasswordCorrect) {
    throw new AuthError("Incorrect password");
  }
};
