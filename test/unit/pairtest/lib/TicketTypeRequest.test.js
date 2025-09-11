import { describe, test, expect } from "vitest";

import TicketTypeRequest from "../../../../src/pairtest/lib/TicketTypeRequest.js"

describe("TicketTypeRequest functionality", () => {
 
  test("should be valid when adult is set as the type", () => {
    const type = new TicketTypeRequest("ADULT", 2);
    expect(type.getTicketType()).toEqual("ADULT");
    expect(type.getNoOfTickets()).toEqual(2);
  });

  test("should be valid when child is set as the type", () => {
    const type = new TicketTypeRequest("CHILD", 1);
    expect(type.getTicketType()).toEqual("CHILD");
    expect(type.getNoOfTickets()).toEqual(1);
  });

  test("should be valid when infant is set as the type", () => {
    const type = new TicketTypeRequest("INFANT", 1);
    expect(type.getTicketType()).toEqual("INFANT");
    expect(type.getNoOfTickets()).toEqual(1);
  });

  test("should throw a TypeError when a null is set as the type", () => {
    expect(() => new TicketTypeRequest(null, 1)).toThrow(TypeError);
  });

  test("should throw a TypeError when an invalid type is set", () => {
    expect(() => new TicketTypeRequest("SENIOR", 1)).toThrow(TypeError);
  });

  test("should throw a TypeError when the ticket count is set as null", () => {
    expect(() => new TicketTypeRequest("ADULT", null)).toThrow(TypeError);
  });

  test("should throw a TypeError when the ticket count is set as a string", () => {
    expect(() => new TicketTypeRequest("ADULT", '124')).toThrow(TypeError);
  });

  test("should not throw an error when the ticket count is set as a negative integer", () => {
    const type = new TicketTypeRequest("ADULT", -1);
    expect(type.getTicketType()).toEqual("ADULT");
    expect(type.getNoOfTickets()).toEqual(-1);
  });
});