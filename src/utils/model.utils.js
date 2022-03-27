import {
  USER_MODEL_KEYS,
  USER_MODEL_NOT_POPULATED_KEYS,
} from "../constants/models.constants";

export const getAuthorPopulatedKeys = () => {
  const populatedKeys = Object.values(USER_MODEL_KEYS).reduce((acc, item) => {
    if (!USER_MODEL_NOT_POPULATED_KEYS.includes(item)) {
      acc[item] = 1;
    }
    return acc;
  }, {});
  return populatedKeys;
};

export const isAllUpdateParamsAllowed = (updatedParams, allowedParams) => updatedParams
  .every((updatedParam) => allowedParams.includes(updatedParam));

