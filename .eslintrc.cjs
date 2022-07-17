const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: ["airbnb-base"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    quotes: ["error", "double"],
    indent: ["error", ERROR],
    "no-multi-spaces": ["error"],
    "import/prefer-default-export": ["off"],
    "func-names": OFF,
    "no-underscore-dangle": ["error", { allow: ["_id"] }],
    "max-classes-per-file": OFF,
    "consistent-return": OFF,
    "no-param-reassign": [
      2,
      {
        props: false,
      },
    ],
  },
};
