/**
 * List of Defintions
 */
export const TICKET_TYPE_ADULT = "ADULT";

export const TICKET_TYPE_CHILD = "CHILD";

export const TICKET_TYPE_INFANT = "INFANT";

export const TICKET_TYPES = [TICKET_TYPE_ADULT, TICKET_TYPE_CHILD, TICKET_TYPE_INFANT]; //mapped from TicketTypeRequest

export const TICKET_TYPE_MAP = [
  { type: TICKET_TYPE_ADULT,  price: 25, requireSeat: true },
  { type: TICKET_TYPE_CHILD,  price: 15, requireSeat: true },
  { type: TICKET_TYPE_INFANT, price: 0,  requireSeat: false }
];

export const MIN_NUMBER_TICKETS = 1;

export const MAX_NUMBER_TICKETS = 25;

export const MIN_ACCOUNT_ID_VALUE = 0;

