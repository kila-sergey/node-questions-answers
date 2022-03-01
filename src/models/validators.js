import validate from "mongoose-validator";

export const emailValidator = [
  validate({
    validator: "isEmail",
    message: "Email is not valid",
  }),
  validate({
    validator(val) {
      return val.length === 0;
    },
    message: "Email is empty",
  }),
];

export const passwordValidator = [
  validate({
    validator(val) {
      return val.length === 0;
    },
    message: "Password is empty",
  }),
  validate({
    validator(val) {
      return val.length > 6;
    },
    message: "Password should be more than 6 symbols",
  }),
  validate({
    validator(val) {
      const hasUpperCaseCharacter = val.split("").some((character) => character.toUpperCase() === character);
      const hasLowerCaseCharacter = val.split("").some((character) => character.toLowerCase() === character);
      return hasLowerCaseCharacter && hasUpperCaseCharacter;
    },
    message: "Password should contain uppercase and lowercase characters",
  }),
];
