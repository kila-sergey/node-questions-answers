import { ForbiddenError } from "../controllers/error.controller";

export const checkAdminOrAuthor = (user, authorId) => {
  const isAccessAllowed = user.isAdmin || user._id.toString() === authorId;

  if (!isAccessAllowed) {
    throw new ForbiddenError("Only admin and author have access to this action");
  }
};

export const checkAdmin = (user) => {
  const isAccessAllowed = user.isAdmin;
  if (!isAccessAllowed) {
    throw new ForbiddenError("Only admin has access to this action");
  }
};
