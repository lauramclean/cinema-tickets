import * as _ from "es-toolkit/compat";
import logger from "../utils/logger.js";
import InvalidPurchaseException from "../pairtest/lib/InvalidPurchaseException.js";
import { TICKET_TYPE_MAP, TICKET_TYPES } from "../utils/constants.js";

export const validateAccountID = (accountId) => {

  logger.debug({ message: "In validateAccountID()" });

  if (!Number.isInteger(accountId) || accountId < 0) {
    throw new TypeError("Invalid account ID - must be greater than 0");
  }
}

/**
 * 
 * @param { String } ticketType 
 * @returns { boolean } returns true if the ticket type provided exists in the valid types
 * @description validates the ticket type
 */
const isValidType = (ticketType) => { return TICKET_TYPES.includes(ticketType) }

/**
 * 
 * @param { Array } ticketTypeRequests 
 * @returns { boolean } returns true if duplicates found
 * @description performs a check to see if there are duplicate ticket types in the request array
 */
const hasDuplicates = (ticketTypeRequests) => { 
  const types = [];
  ticketTypeRequests.forEach(ticket => types.push(ticket.getTicketType()));
  return _.uniq(types).length !== ticketTypeRequests.length;
}

/**
 * 
 * @param {Array} ticketTypeRequests 
 * @description validates the ticket types are rules about ticket presence
 */
export const validateTicketRequest = (ticketTypeRequests) => {
  logger.debug({ message: "In validateTicketTypes()" });

  if (!Array.isArray(ticketTypeRequests) || !ticketTypeRequests?.length) {
    throw new TypeError("Invalid request type - requires at least 1 ticket request to be present");
  }

  if (ticketTypeRequests.length > TICKET_TYPE_MAP.length) {
    throw new TypeError("Number of ticket types exceeds maximum supported types");
  }

  if (hasDuplicates(ticketTypeRequests)) {
    throw new TypeError("Must only have one instance of each ticket type");
  }
    
  ticketTypeRequests.forEach(ticket => {
    if (!isValidType(ticket.getTicketType())) {
      throw new TypeError("Invalid ticket type");
    }
    if (ticket.getNoOfTickets() <= 0) {
      throw new InvalidPurchaseException("Expected at least one ticket");
    }
  });
}