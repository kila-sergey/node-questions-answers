import jwt from "jsonwebtoken";
import { sendError, AuthError } from "../controllers/error.controller";
import User from "../models/user.model";

const authMiddleware = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throw new AuthError("Authorization token wasnt't provided");
    }
    const token = req.headers.authorization.replace("Bearer ", "");
    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decodedToken._id, tokens: token });

    if (!user) {
      throw new AuthError("Authorization required");
    }

    req.user = user;
    req.token = token;

    next();
  } catch (err) {
    return sendError(res, new AuthError(err.message));
  }
};

export default authMiddleware;
