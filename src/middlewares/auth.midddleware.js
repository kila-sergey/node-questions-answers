import jwt from "jsonwebtoken";
import { sendError, AuthError } from "../controllers/error.controller";
import { User } from "../models/user.model";
import { checkUserExists, checkTokenProvided } from "../validators/auth.validator";

export const authMiddleware = async (req, res, next) => {
  try {
    checkTokenProvided(req);

    const token = req.headers.authorization.replace("Bearer ", "");
    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decodedToken._id, tokens: token });

    checkUserExists(user);

    req.user = user;
    req.token = token;

    next();
  } catch (err) {
    return sendError(res, new AuthError(err.message));
  }
};
