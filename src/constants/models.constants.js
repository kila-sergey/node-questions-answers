export const QUESTION_MODEL_NAME = "Question";
export const ANSWER_MODEL_NAME = "Answer";
export const USER_MODEL_NAME = "User";
export const FILE_MODEL_NAME = "File";

export const PASSWORD_HASH_SALT_ROUNDS = 8;

export const USER_MODEL_KEYS = {
  NAME: "name",
  EMAIL: "email",
  PASSWORD: "password",
  IS_ADMIN: "isAdmin",
  ANSWERS: "answers",
  QUESTIONS: "questions",
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

export const QUESTION_MODEL_EDITABLE_KEYS = [
  QUESTION_MODEL_KEYS.TITLE,
  QUESTION_MODEL_KEYS.DESCRIPTION,
];

export const ANSWER_MODEL_KEYS = {
  TEXT: "text",
  RATING: "rating",
  AUTHOR: "author",
  QUESTION_ID: "questionId",
};

export const ANSWER_MODEL_EDITABLE_KEYS = [ANSWER_MODEL_KEYS.TEXT];

export const USER_MODEL_PRIVATE_KEYS = [USER_MODEL_KEYS.PASSWORD, USER_MODEL_KEYS.TOKENS];
export const USER_MODEL_NOT_POPULATED_KEYS = [
  ...USER_MODEL_PRIVATE_KEYS,
  USER_MODEL_KEYS.ANSWERS,
  USER_MODEL_KEYS.QUESTIONS,
];
