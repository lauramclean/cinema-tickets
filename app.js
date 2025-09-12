import TicketTypeRequest from "./src/pairtest/lib/TicketTypeRequest.js";
import TicketService from "./src/pairtest/TicketService.js";
import logger from "./src/utils/logger.js";

logger.info({ message: "In cinema-ticket purchase service"});

const requests = [
  new TicketTypeRequest("ADULT", 2),
  new TicketTypeRequest("CHILD", 3),
  new TicketTypeRequest("INFANT", 1),
];

const result = new TicketService().purchaseTickets(1234, ...requests);

logger.info({ message: `TicketService returned with ${JSON.stringify(result)}`});