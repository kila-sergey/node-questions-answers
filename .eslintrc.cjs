module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ["airbnb-base"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    quotes: ["error", "double"],
    indent: ["error", 2],
    "no-multi-spaces": ["error"],
    "import/prefer-default-export": ["off"],
  },
};
