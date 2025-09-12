import { describe, test, vi, beforeEach, afterAll, expect } from "vitest";

import logger from "../../../src/utils/logger.js";
import TicketService from "../../../src/pairtest/TicketService.js";
import TicketTypeRequest from "../../../src/pairtest/lib/TicketTypeRequest";

vi.mock("../../../src/helpers/ValidateRequest.js");
vi.mock("../../../src/helpers/CalculationHelper.js");
vi.mock("../../../src/thirdparty/paymentgateway/TicketPaymentService.js");
vi.mock("../../../src/thirdparty/seatbooking/SeatBookingService.js");

describe("TicketService tests", () => {
 
  const ticketService = new TicketService();
  const accountId = 123;
  const ticketTypeRequests = [
    new TicketTypeRequest("ADULT", 2),
    new TicketTypeRequest("CHILD", 2),
    new TicketTypeRequest("INFANT", 1)
  ];

  beforeEach(() => {
    vi.spyOn(logger, "debug");
    vi.spyOn(logger, "error")
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  test("should be defined", () => {
    expect(ticketService.purchaseTickets).toBeDefined();
  });

  test("should throw an error when validation of the request fails", () => {

    //mock the validation helper and force an error
    //spy on calculation helper, ticket payment + booking service and they should not be called
    //expect purchaseTickets to throw the error
    expect(() => { ticketService.purchaseTickets(accountId, ticketTypeRequests).toThrow() });
  });

  test("should throw an error vhen the payment service returns an error", () => {

    //mock the validation helper so it doesnt throw an error
    //mock the calculation helper to return a value
    //mock the payment service to return an error
    //spyon booking service to not be called.
    //expect purchaseTickets to throw the error
    expect(() => { ticketService.purchaseTickets(accountId, ticketTypeRequests).toThrow() });
  });

  test("should throw an error vhen the booking service returns an error", () => {

    //mock the validation helper so it doesnt throw an error
    //mock the calculation helper to return a value
    //mock the payment service to succeed
    //mock the booking service to throw an error
    //expect purchaseTickets to throw the error
    expect(() => { ticketService.purchaseTickets(accountId, ticketTypeRequests).toThrow() });
  });

  test("should return the the cost of the purchase with the number of allocated seats", () => {

    //mock the validation helper so it doesnt throw an error
    //mock the calculation helper to return a value
    //mock the payment service to succeed
    //mock the booking service to succeed
    //expect purchaseTickets to return with the cost and seats allocated
    const purchase = ticketService.purchaseTickets(accountId, ticketTypeRequests);
    expect(purchase).toBeDefined();
  });  
});