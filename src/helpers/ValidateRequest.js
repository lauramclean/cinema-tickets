import * as _ from "es-toolkit/compat";
import logger from "../utils/logger.js";
import InvalidPurchaseException from "../pairtest/lib/InvalidPurchaseException.js";
import * as constants from "../utils/constants.js";
import TicketTypeRequest from "../pairtest/lib/TicketTypeRequest.js";

/**
 * 
 * @param {number} accountId 
 * @param {Array} ticketTypeRequests
 * @description wrapper function to run the validation checks. Any failures will result in an error being thrown
 */
export const validateRequest = (accountID, ticketTypeRequests) => {
  logger.debug({ message: "In validateRequest()" });
  
  validateAccountID(accountID);
  validateTicketRequest(ticketTypeRequests);
  validatePurchaseTypeRules(ticketTypeRequests);
};

/**
 * 
 * @param {Number} accountId 
 * @description validates the account is numeric. Throws error when invalid
 */
export const validateAccountID = (accountId) => {

  logger.debug({ message: "In validateAccountID()" });

  if (!Number.isInteger(accountId) || accountId <= constants.MIN_ACCOUNT_ID_VALUE) {
    throw new TypeError("Invalid account ID - must be greater than 0");
  }
}

/**
 * 
 * @param { String } ticketType 
 * @returns { boolean } returns true if the ticket type provided exists in the valid types
 * @description validates the ticket type
 */
const isValidType = (ticketType) => { return constants.TICKET_TYPES.includes(ticketType) }

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
 * @description validates the ticket types and throws an error when invalid
 */
export const validateTicketRequest = (ticketTypeRequests) => {
  logger.debug({ message: "In validateTicketTypes()" });

  if (!Array.isArray(ticketTypeRequests) || !ticketTypeRequests?.length) {
    throw new TypeError("Invalid request type - requires at least 1 ticket request to be present");
  }

  ticketTypeRequests.forEach(ticket => {
    if (!(ticket instanceof TicketTypeRequest)) {
      throw new TypeError("Should be of TicketTypeRequest type");       
    }
    if (!isValidType(ticket.getTicketType())) {
      throw new TypeError("Invalid ticket type");
    }
    if (ticket.getNoOfTickets() <= 0) {
      throw new TypeError("Expected at least one ticket");
    }
  });  

  if (hasDuplicates(ticketTypeRequests)) {
    throw new TypeError("Must only have one instance of each ticket type");
  }
}

/**
 * 
 * @param {Array} ticketTypeRequests 
 * @description validates the request against the business rules. Throws an error when invalid.
 * Assumes validateTicketRequest() has been called first to validate the array.
 */
export const validatePurchaseTypeRules = (ticketTypeRequests) => {
  logger.debug({ message: "In validatePurchaseTypeRules()" });

  //Validate in order or precedence - require at least 1 adult which means no need
  //to check explicitly for child + infant without an adult.
  //Then check number of infants, if present match up with number of adults as it is a
  //requirement that an infant will be sat on an adults lap.
  const adult = _.find(ticketTypeRequests, (type) => type.getTicketType() === constants.TICKET_TYPE_ADULT);
  if (!adult) {
    throw new InvalidPurchaseException("Requires at least 1 adult to be present");
  }

  const infant = _.find(ticketTypeRequests, (type) => type.getTicketType() === constants.TICKET_TYPE_INFANT)
  if (infant?.getNoOfTickets() > adult.getNoOfTickets()) {
    throw new InvalidPurchaseException("Requires at least 1 adult per infant to be present");
  }

  const ticketCount = _.sum(_.map(ticketTypeRequests, (item) => item.getNoOfTickets()));
  if (ticketCount < constants.MIN_NUMBER_TICKETS || ticketCount > constants.MAX_NUMBER_TICKETS) {
    throw new InvalidPurchaseException("Must have at least one ticket or maximum of 25 tickets")
  }
}