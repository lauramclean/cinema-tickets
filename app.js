import TicketTypeRequest from "./src/pairtest/lib/TicketTypeRequest.js";
import TicketService from "./src/pairtest/TicketService.js";
import logger from "./src/utils/logger.js";
import { TICKET_TYPE_ADULT, TICKET_TYPE_CHILD, TICKET_TYPE_INFANT} from "./src/utils/constants.js";

logger.info({ message: "In cinema-ticket purchase service"});

const requests = [
  new TicketTypeRequest(TICKET_TYPE_ADULT, 2),
  new TicketTypeRequest(TICKET_TYPE_CHILD, 3),
  new TicketTypeRequest(TICKET_TYPE_INFANT, 1),
];

const result = new TicketService().purchaseTickets(1234, ...requests);

logger.info({ message: `TicketService returned with ${JSON.stringify(result)}`});