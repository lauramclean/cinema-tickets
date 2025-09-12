import { describe, test, expect } from "vitest";

import { TICKET_TYPE_ADULT, TICKET_TYPE_CHILD, TICKET_TYPE_INFANT } from "../../../../src/utils/constants.js";
import TicketTypeRequest from "../../../../src/pairtest/lib/TicketTypeRequest.js";

describe("TicketTypeRequest functionality", () => {
 
  test("should be valid when adult is set as the type", () => {
    const type = new TicketTypeRequest(TICKET_TYPE_ADULT, 2);
    expect(type.getTicketType()).toEqual(TICKET_TYPE_ADULT);
    expect(type.getNoOfTickets()).toEqual(2);
  });

  test("should be valid when child is set as the type", () => {
    const type = new TicketTypeRequest(TICKET_TYPE_CHILD, 1);
    expect(type.getTicketType()).toEqual(TICKET_TYPE_CHILD);
    expect(type.getNoOfTickets()).toEqual(1);
  });

  test("should be valid when infant is set as the type", () => {
    const type = new TicketTypeRequest(TICKET_TYPE_INFANT, 1);
    expect(type.getTicketType()).toEqual(TICKET_TYPE_INFANT);
    expect(type.getNoOfTickets()).toEqual(1);
  });

  test("should throw a TypeError when a null is set as the type", () => {
    expect(() => new TicketTypeRequest(null, 1)).toThrow(TypeError);
  });

  test("should throw a TypeError when an invalid type is set", () => {
    expect(() => new TicketTypeRequest("SENIOR", 1)).toThrow(TypeError);
  });

  test("should throw a TypeError when the ticket count is set as null", () => {
    expect(() => new TicketTypeRequest(TICKET_TYPE_ADULT, null)).toThrow(TypeError);
  });

  test("should throw a TypeError when the ticket count is set as a string", () => {
    expect(() => new TicketTypeRequest(TICKET_TYPE_ADULT, '124')).toThrow(TypeError);
  });

  test("should not throw an error when the ticket count is set as a negative integer", () => {
    const type = new TicketTypeRequest(TICKET_TYPE_ADULT, -1);
    expect(type.getTicketType()).toEqual(TICKET_TYPE_ADULT);
    expect(type.getNoOfTickets()).toEqual(-1);
  });
});