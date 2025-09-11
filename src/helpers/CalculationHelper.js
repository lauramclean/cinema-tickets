import { TICKET_TYPE_MAP } from "../utils/constants.js";
import logger from "../utils/logger.js";

/**
 * 
 * @param  {Array} ticketTypeRequests 
 * @returns {Number} number of seats required
 */
export const calculateNumSeats = (ticketTypeRequests) => {
  logger.debug({ message: "In calculateNumSeats()" });
  
  let numSeats = 0;

  //for each ticket type that has been requested, obtain from the 
  //mapping whether a seat is required, if so, multiply it by the number
  //of tickets requested. 
  ticketTypeRequests?.forEach(requestedType => {
    const seatRequired = TICKET_TYPE_MAP.find(i => i.type === requestedType.getTicketType())?.requireSeat;
    if (seatRequired) {  
      numSeats += requestedType.getNoOfTickets();
    }
  });

  logger.debug({ message: `calculateNumSeats returning with numSeats: ${numSeats}`} ); 
  return numSeats;    
}

/**
 * 
 * @param  {Array} ticketTypeRequests 
 * @returns {Number} cost of the tickets
 */
export const calculateTotalCost = (ticketTypeRequests) => {
  logger.debug({ message: "In calculateTotalCost()" });

  let totalCost = 0;

  //for each ticket type that has been requested, obtain from the 
  //mapping whether a seat is required, if so, multiply it by the number
  //of tickets requested. 
  ticketTypeRequests?.forEach(requestedType => {
    const ticketPrice = TICKET_TYPE_MAP.find(i => i.type === requestedType.getTicketType())?.price;
    if (ticketPrice) {  
      totalCost += requestedType.getNoOfTickets() * ticketPrice;
    }
  });

  logger.debug({ message: `calculateTotalCost returning with totalCost: £${totalCost}`} );    
  return totalCost;    
}