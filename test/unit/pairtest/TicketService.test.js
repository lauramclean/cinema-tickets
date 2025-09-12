import { describe, test, vi, beforeEach, expect, afterEach } from "vitest";
import * as validationHelper from "../../../src/helpers/ValidateRequest.js";
import * as calculationHelper from "../../../src/helpers/CalculationHelper.js";
import { TICKET_TYPE_ADULT, TICKET_TYPE_CHILD, TICKET_TYPE_INFANT } from "../../../src/utils/constants.js";
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
  const seatNumbers = 2;
  const totalCost = 20;
  const ticketTypeRequests = [
    new TicketTypeRequest(TICKET_TYPE_ADULT, 2),
    new TicketTypeRequest(TICKET_TYPE_CHILD, 2),
    new TicketTypeRequest(TICKET_TYPE_INFANT, 1)
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
    vi.mocked(calculationHelper.calculateTotalCost).mockImplementation(() => { return totalCost });
    vi.mocked(calculationHelper.calculateNumSeats).mockImplementation(() => { return seatNumbers });
    TicketPaymentService.prototype.makePayment = vi.fn().mockImplementation(() => {});
    SeatReservationService.prototype.reserveSeat = vi.fn().mockImplementation(() => {});

    // Test the service
    expect(() => ticketService.purchaseTickets(accountId, ticketTypeRequests)).toThrowError("Purchase failed: invalid account id");

    expect(logger.debug).toHaveBeenCalledWith(expect.objectContaining({ message: "In purchaseTickets()"}));
    expect(logger.error).toHaveBeenCalledWith(expect.objectContaining({ message: `Purchase request unsuccessful: invalid account id`}));
    expect(logger.info).not.toHaveBeenCalled();    
    expect(validationHelper.validateRequest).toThrowError(TypeError);
    expect(validationHelper.validateRequest).toHaveBeenCalledWith(accountId, expect.any(Array));
    expect(calculationHelper.calculateTotalCost).not.toHaveBeenCalled();
    expect(calculationHelper.calculateNumSeats).not.toHaveBeenCalled();
    expect(TicketPaymentService.prototype.makePayment).not.toHaveBeenCalled();
    expect(SeatReservationService.prototype.reserveSeat).not.toHaveBeenCalled();
  });

  test("should throw an error vhen the payment service returns an error", () => {

    vi.mocked(validationHelper.validateRequest).mockImplementation(() => {});
    vi.mocked(calculationHelper.calculateTotalCost).mockImplementation(() => { return totalCost });
    vi.mocked(calculationHelper.calculateNumSeats).mockImplementation(() => { return seatNumbers });
    TicketPaymentService.prototype.makePayment = vi.fn().mockImplementation(() => { throw new InvalidPurchaseException("payment failed"); });
    SeatReservationService.prototype.reserveSeat = vi.fn().mockImplementation(() => {});

    // Test the service
    expect(() => ticketService.purchaseTickets(accountId, ticketTypeRequests)).toThrowError("Purchase failed: payment failed");

    expect(logger.debug).toHaveBeenCalledWith(expect.objectContaining({ message: "In purchaseTickets()"}));
    expect(logger.info).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith(expect.objectContaining({ message: `Purchase request unsuccessful: payment failed`}));
    expect(validationHelper.validateRequest).toHaveBeenCalledWith(accountId, expect.any(Array));
    expect(calculationHelper.calculateTotalCost).toHaveBeenCalled();
    expect(calculationHelper.calculateNumSeats).toHaveBeenCalled();
    expect(TicketPaymentService.prototype.makePayment).toHaveBeenCalledWith(accountId, totalCost);
    expect(TicketPaymentService.prototype.makePayment).toThrowError(InvalidPurchaseException);  
    expect(SeatReservationService.prototype.reserveSeat).not.toHaveBeenCalled();   
  });

  test("should throw an error vhen the booking service returns an error", () => {

    vi.mocked(validationHelper.validateRequest).mockImplementation(() => {});
    vi.mocked(calculationHelper.calculateTotalCost).mockImplementation(() => { return totalCost });
    vi.mocked(calculationHelper.calculateNumSeats).mockImplementation(() => { return seatNumbers });
    TicketPaymentService.prototype.makePayment = vi.fn().mockImplementation(() => {});
    SeatReservationService.prototype.reserveSeat = vi.fn().mockImplementation(() => { throw new InvalidPurchaseException("seat reservations failed"); });

    // Test the service
    expect(() => ticketService.purchaseTickets(accountId, ticketTypeRequests)).toThrowError("Purchase failed: seat reservations failed");

    expect(logger.debug).toHaveBeenCalledWith(expect.objectContaining({ message: "In purchaseTickets()"}));
    expect(logger.error).toHaveBeenCalledWith(expect.objectContaining({ message: `Purchase request unsuccessful: seat reservations failed`}));
    expect(logger.info).not.toHaveBeenCalled();
    expect(validationHelper.validateRequest).toHaveBeenCalledWith(accountId, expect.any(Array));
    expect(calculationHelper.calculateTotalCost).toHaveBeenCalled();
    expect(calculationHelper.calculateNumSeats).toHaveBeenCalled();
    expect(TicketPaymentService.prototype.makePayment).toHaveBeenCalledWith(accountId, totalCost);
    expect(SeatReservationService.prototype.reserveSeat).toHaveBeenCalledWith(accountId, seatNumbers);
    expect(SeatReservationService.prototype.reserveSeat).toThrowError(InvalidPurchaseException);  
  });

  test("should return the the cost of the purchase with the number of allocated seats", () => {

    vi.mocked(validationHelper.validateRequest).mockImplementation(() => {});
    vi.mocked(calculationHelper.calculateTotalCost).mockImplementation(() => { return totalCost });
    vi.mocked(calculationHelper.calculateNumSeats).mockImplementation(() => { return seatNumbers });
    TicketPaymentService.prototype.makePayment = vi.fn().mockImplementation(() => {});
    SeatReservationService.prototype.reserveSeat = vi.fn().mockImplementation(() => {});

    // Test the service  
    const purchase = ticketService.purchaseTickets(accountId, ticketTypeRequests);

    expect(purchase).toBeDefined();
    expect(purchase).toEqual({ price: totalCost, seatsReserved: seatNumbers });

    expect(logger.debug).toHaveBeenCalledWith(expect.objectContaining({ message: "In purchaseTickets()"}));
    expect(logger.info).toHaveBeenCalledWith(expect.objectContaining({ message: `Booking successful. Total cost £${totalCost} and ${seatNumbers} seats booked`}));
    expect(logger.error).not.toHaveBeenCalled();
    expect(validationHelper.validateRequest).toHaveBeenCalledWith(accountId, expect.any(Array));
    expect(calculationHelper.calculateTotalCost).toHaveBeenCalled();
    expect(calculationHelper.calculateNumSeats).toHaveBeenCalled();
    expect(TicketPaymentService.prototype.makePayment).toHaveBeenCalledWith(accountId, totalCost);
    expect(SeatReservationService.prototype.reserveSeat).toHaveBeenCalledWith(accountId, seatNumbers);
  });
});