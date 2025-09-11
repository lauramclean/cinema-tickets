/**
 * List of Defintions
 */

export const TICKET_TYPES = ["ADULT", "CHILD", "INFANT"]; //mapped from TicketTypeRequest

export const TICKET_TYPE_MAP = [
  { type: "ADULT",  price: 25, requireSeat: true },
  { type: "CHILD",  price: 15, requireSeat: true },
  { type: "INFANT", price: 0,  requireSeat: false }
];