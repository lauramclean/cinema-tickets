import { describe, test, vi, beforeEach, expect, afterEach } from "vitest";
import * as validationHelper from "../../../src/helpers/ValidateRequest.js";
import * as calculationHelper from "../../../src/helpers/CalculationHelper.js";
import logger from "../../../src/utils/logger.js";
import TicketService from "../../../src/pairtest/TicketService.js";
import TicketTypeRequest from "../../../src/pairtest/lib/TicketTypeRequest";
import TicketPaymentService from "../../../src/thirdparty/paymentgateway/TicketPaymentService.js";
import SeatReservationService from "../../../src/thirdparty/seatbooking/SeatReservationService.js";
import InvalidPurchaseException from "../../../src/pairtest/lib/InvalidPurchaseException.js";

vi.mock("../../../src/helpers/ValidateRequest.js");
vi.mock("../../../src/helpers/CalculationHelper.js");
vi.mock("../../../src/thirdparty/paymentgateway/TicketPaymentService.js", { spy: true });
vi.mock("../../../src/thirdparty/seatbooking/SeatBookingService.js", { spy: true });
    
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
    vi.spyOn(logger, "info");
    vi.spyOn(logger, "error");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("should be defined", () => {
    expect(ticketService.purchaseTickets).toBeDefined();
  });

  test("should throw an error when validation of the request fails", () => {

    vi.mocked(validationHelper.validateRequest).mockImplementation(() => { throw new TypeError("invalid account id")});
    vi.mocked(calculationHelper.calculateTotalCost).mockImplementation(() => { return 20 });
    vi.mocked(calculationHelper.calculateNumSeats).mockImplementation(() => { return 2 });

    TicketPaymentService.prototype.makePayment = vi.fn().mockImplementation(() => { throw new InvalidPurchaseException("something failed"); });
    SeatReservationService.prototype.reserveSeat = vi.fn().mockImplementation(() => { throw new InvalidPurchaseException("something failed"); });

    try {
     ticketService.purchaseTickets(accountId, ticketTypeRequests);
    } catch (error) {
      expect(error.message).toEqual("invalid account id");
    }

    //expect(() => ticketService.purchaseTickets(accountId, ticketTypeRequests).toThrowError("invalid account id"));

    expect(logger.debug).toHaveBeenCalledWith(expect.objectContaining({ message: "In purchaseTickets()"}));
    expect(logger.error).toHaveBeenCalledWith(expect.objectContaining({ message: `Purchase request unsuccessful: invalid account id`}));
    expect(validationHelper.validateTicketRequest).not.toHaveBeenCalled();
    expect(calculationHelper.calculateTotalCost).not.toHaveBeenCalled();
    expect(calculationHelper.calculateNumSeats).not.toHaveBeenCalled();
    expect(TicketPaymentService.prototype.makePayment).not.toHaveBeenCalled();
    expect(SeatReservationService.prototype.reserveSeat).not.toHaveBeenCalled();
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