export const QUESTION_MODEL_NAME = "Question";
export const ANSWER_MODEL_NAME = "Answer";
export const USER_MODEL_NAME = "User";

export const PASSWORD_HASH_SALT_ROUNDS = 8;

export const USER_MODEL_KEYS = {
  NAME: "name",
  EMAIL: "email",
  PASSWORD: "password",
  IS_ADMIN: "isAdmin",
  ANSWERS: "answers",
  QUESTION: "questions",
  TOKENS: "tokens",
  CREATED_AT: "createdAt",
  UPDATED_AT: "updatedAt",
};

export const QUESTION_MODEL_KEYS = {
  RATING: "rating",
  TITLE: "title",
  DESCRIPTION: "description",
  AUTHOR: "author",
  TAGS: "tags",
  ANSWERS: "answers",
};

export const ANSWER_MODEL_KEYS = {
  TEXT: "text",
  RATING: "rating",
  AUTHOR: "author",
  QUESTIONID: "questionId",
};

export const USER_MODEL_PRIVATE_KEYS = [USER_MODEL_KEYS.PASSWORD, USER_MODEL_KEYS.TOKENS];
export const USER_MODEL_NOT_POPULATED_KEYS = [
  ...USER_MODEL_PRIVATE_KEYS,
  USER_MODEL_KEYS.ANSWERS,
  USER_MODEL_KEYS.QUESTION,
];
