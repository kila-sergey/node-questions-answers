import { sendError } from "../controllers/error.controller";
import { checkAdmin } from "../validators/access.validator";

export const protectedStrictQuestionMiddleware = async (req, res, next) => {
  try {
    const { user } = req;

    checkAdmin(user);

    next();
  } catch (err) {
    sendError(res, err);
  }
};
