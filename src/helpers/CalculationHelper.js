import { TICKET_TYPE_MAP } from "../utils/constants.js";
import logger from "../utils/logger.js";

/**
 * 
 * @param  {Array} ticketTypeRequests 
 * @description calculates the total number of seats required 
 * @returns {Number} number of seats required
 */
export const calculateNumSeats = (ticketTypeRequests) => {
  logger.debug({ message: "In calculateNumSeats()" });
  
  let numSeats = 0;

  //Seats may be optional, if required for the given ticket type multiply by num tickets requested
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
 * @description calculates the total cost of the requested tickets
 * @returns {Number} cost of the tickets
 */
export const calculateTotalCost = (ticketTypeRequests) => {
  logger.debug({ message: "In calculateTotalCost()" });

  let totalCost = 0;

  //Price may be optional, if set for the given ticket type multiply by num tickets requested
  ticketTypeRequests?.forEach(requestedType => {
    const ticketPrice = TICKET_TYPE_MAP.find(i => i.type === requestedType.getTicketType())?.price;
    if (ticketPrice) {  
      totalCost += requestedType.getNoOfTickets() * ticketPrice;
    }
  });

  logger.debug({ message: `calculateTotalCost returning with totalCost: £${totalCost}`} );    
  return totalCost;    
}