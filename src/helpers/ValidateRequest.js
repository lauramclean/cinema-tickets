import logger from "../utils/logger.js";

export const validateAccountID = (accountId) => {

  logger.debug({ message: "In validateAccountID()" });

  if (!Number.isInteger(accountId) || accountId < 0) {
    throw new TypeError("Invalid account ID - must be greater than 0");
  }
}
