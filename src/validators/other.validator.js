import { VOTING_TYPE } from "../constants/other.constants";
import { ForbiddenError, BadRequestError } from "../controllers/error.controller";

export const checkIfVoted = (type, userRatingValue) => {
  if (type === VOTING_TYPE.UP && userRatingValue > 0) {
    throw new ForbiddenError("You have already voted up");
  }
  if (type === VOTING_TYPE.DOWN && userRatingValue < 0) {
    throw new ForbiddenError("You have already voted down");
  }
};

export const isAllUpdateParamsAllowed = (updatedParams, allowedParams) => updatedParams
  .every((updatedParam) => allowedParams.includes(updatedParam));

export const checkUpdateParamsValid = (updateParamsArray, allowedParamsArray) => {
  if (updateParamsArray.length === 0
    || !isAllUpdateParamsAllowed(updateParamsArray, allowedParamsArray)) {
    throw new BadRequestError("Invalid update params");
  }
};
