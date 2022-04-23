import { sendError, ForbiddenError } from "../controllers/error.controller";

export const protectedStrictQuestionMiddleware = async (req, res, next) => {
  try {
    const { user } = req;

    const isAccessAllowed = user.isAdmin;
    if (!isAccessAllowed) {
      throw new ForbiddenError("Only admin has access to this action");
    }

    next();
  } catch (err) {
    sendError(res, err);
  }
};
