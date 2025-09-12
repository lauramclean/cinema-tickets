import { describe, test, expect, vi, beforeEach, afterAll } from "vitest";

import { TICKET_TYPE_ADULT, TICKET_TYPE_CHILD, TICKET_TYPE_INFANT } from "../../../src/utils/constants.js";
import logger from "../../../src/utils/logger.js";
import * as helper from "../../../src/helpers/CalculationHelper.js"
import TicketTypeRequest from "../../../src/pairtest/lib/TicketTypeRequest.js";

describe("Calculation helper functions", () => {

  beforeEach(() => {
    vi.spyOn(logger, "debug");
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  //Calculate total cost
  //Calculate seats required

  describe("Calculate total cost", () => {
    test("should be defined", () => {
      expect(helper.calculateTotalCost).toBeDefined();
    });

    test("should return 0 when ticket type request is empty", () => {
      expect(helper.calculateTotalCost([])).toBe(0);
      expect(logger.debug).toHaveBeenCalledTimes(2);
      expect(logger.debug).toHaveBeenNthCalledWith(1, expect.objectContaining({message: `In calculateTotalCost()`}));
      expect(logger.debug).toHaveBeenNthCalledWith(2, expect.objectContaining({message: `calculateTotalCost returning with totalCost: £0`}));  
    });

    test("should return 25 when a single adult tickets are requested", () => {
      expect(helper.calculateTotalCost([
        new TicketTypeRequest(TICKET_TYPE_ADULT, 1)
      ])).toBe(25);
      expect(logger.debug).toHaveBeenCalledTimes(2);
      expect(logger.debug).toHaveBeenNthCalledWith(1, expect.objectContaining({message: `In calculateTotalCost()`}));
      expect(logger.debug).toHaveBeenNthCalledWith(2, expect.objectContaining({message: `calculateTotalCost returning with totalCost: £25`}));       
    });

    test("should return 50 when two adult tickets are requested", () => {
      expect(helper.calculateTotalCost([
        new TicketTypeRequest(TICKET_TYPE_ADULT, 2)
      ])).toBe(50);
      expect(logger.debug).toHaveBeenCalledTimes(2);
      expect(logger.debug).toHaveBeenNthCalledWith(1, expect.objectContaining({message: `In calculateTotalCost()`}));
      expect(logger.debug).toHaveBeenNthCalledWith(2, expect.objectContaining({message: `calculateTotalCost returning with totalCost: £50`}));      
    });

    test("should return 40 when one adult ticket plus one child tickets are requested", () => {
      expect(helper.calculateTotalCost([
        new TicketTypeRequest(TICKET_TYPE_ADULT, 1),
        new TicketTypeRequest(TICKET_TYPE_CHILD, 1)        
      ])).toBe(40);
      expect(logger.debug).toHaveBeenCalledTimes(2);
      expect(logger.debug).toHaveBeenNthCalledWith(1, expect.objectContaining({message: `In calculateTotalCost()`}));
      expect(logger.debug).toHaveBeenNthCalledWith(2, expect.objectContaining({message: `calculateTotalCost returning with totalCost: £40`}));       
    });

    test("should return 40 when one adult, child and infant tickets are requested", () => {
      expect(helper.calculateTotalCost([
        new TicketTypeRequest(TICKET_TYPE_ADULT, 1),
        new TicketTypeRequest(TICKET_TYPE_CHILD, 1),
        new TicketTypeRequest(TICKET_TYPE_INFANT, 1),
      ])).toBe(40);
      expect(logger.debug).toHaveBeenCalledTimes(2);
      expect(logger.debug).toHaveBeenNthCalledWith(1, expect.objectContaining({message: `In calculateTotalCost()`}));
      expect(logger.debug).toHaveBeenNthCalledWith(2, expect.objectContaining({message: `calculateTotalCost returning with totalCost: £40`}));      
    });

    test("should return 95 when two adults, three child and 2 infant tickets are requested", () => {
      expect(helper.calculateTotalCost([
        new TicketTypeRequest(TICKET_TYPE_ADULT, 2),
        new TicketTypeRequest(TICKET_TYPE_CHILD, 3),
        new TicketTypeRequest(TICKET_TYPE_INFANT, 2),
      ])).toBe(95);
      expect(logger.debug).toHaveBeenCalledTimes(2);
      expect(logger.debug).toHaveBeenNthCalledWith(1, expect.objectContaining({message: `In calculateTotalCost()`}));
      expect(logger.debug).toHaveBeenNthCalledWith(2, expect.objectContaining({message: `calculateTotalCost returning with totalCost: £95`}));       
    });

   test("should return 0 when a single infant is requested", () => {
      expect(helper.calculateTotalCost([
        new TicketTypeRequest(TICKET_TYPE_INFANT, 1),
      ])).toBe(0);
      expect(logger.debug).toHaveBeenCalledTimes(2);
      expect(logger.debug).toHaveBeenNthCalledWith(1, expect.objectContaining({message: `In calculateTotalCost()`}));
      expect(logger.debug).toHaveBeenNthCalledWith(2, expect.objectContaining({message: `calculateTotalCost returning with totalCost: £0`}));   
    });

   test("should return 0 when the ticket count per type is zero", () => {
      expect(helper.calculateTotalCost([
        new TicketTypeRequest(TICKET_TYPE_ADULT, 0),
        new TicketTypeRequest(TICKET_TYPE_CHILD, 0),
        new TicketTypeRequest(TICKET_TYPE_INFANT, 0),
      ])).toBe(0);
      expect(logger.debug).toHaveBeenCalledTimes(2);
      expect(logger.debug).toHaveBeenNthCalledWith(1, expect.objectContaining({message: `In calculateTotalCost()`}));
      expect(logger.debug).toHaveBeenNthCalledWith(2, expect.objectContaining({message: `calculateTotalCost returning with totalCost: £0`}));      
    });
  });

  describe("Calculate number of seats", () => {

    test("should be defined", () => {
      expect(helper.calculateNumSeats).toBeDefined();
    });

    test("should return zero when ticket type request is empty", () => {
      expect(helper.calculateNumSeats([])).toBe(0);
      expect(logger.debug).toHaveBeenCalledTimes(2);
      expect(logger.debug).toHaveBeenNthCalledWith(1, expect.objectContaining({message: `In calculateNumSeats()`}));
      expect(logger.debug).toHaveBeenNthCalledWith(2, expect.objectContaining({message: `calculateNumSeats returning with numSeats: 0`}));
    });

    test("should return 1 when a single adult tickets are requested", () => {
      expect(helper.calculateNumSeats([
        new TicketTypeRequest(TICKET_TYPE_ADULT, 1)
      ])).toBe(1);
      expect(logger.debug).toHaveBeenCalledTimes(2);
      expect(logger.debug).toHaveBeenNthCalledWith(1, expect.objectContaining({message: `In calculateNumSeats()`}));
      expect(logger.debug).toHaveBeenNthCalledWith(2, expect.objectContaining({message: `calculateNumSeats returning with numSeats: 1`}));      
    });

    test("should return 2 when two adult tickets are requested", () => {
      expect(helper.calculateNumSeats([
        new TicketTypeRequest(TICKET_TYPE_ADULT, 2)
      ])).toBe(2);
      expect(logger.debug).toHaveBeenCalledTimes(2);
      expect(logger.debug).toHaveBeenNthCalledWith(1, expect.objectContaining({message: `In calculateNumSeats()`}));
      expect(logger.debug).toHaveBeenNthCalledWith(2, expect.objectContaining({message: `calculateNumSeats returning with numSeats: 2`}));        
    });

    test("should return 2 when one adult ticket plus one child tickets are requested", () => {
      expect(helper.calculateNumSeats([
        new TicketTypeRequest(TICKET_TYPE_ADULT, 1),
        new TicketTypeRequest(TICKET_TYPE_CHILD, 1)        
      ])).toBe(2);
      expect(logger.debug).toHaveBeenCalledTimes(2);
      expect(logger.debug).toHaveBeenNthCalledWith(1, expect.objectContaining({message: `In calculateNumSeats()`}));
      expect(logger.debug).toHaveBeenNthCalledWith(2, expect.objectContaining({message: `calculateNumSeats returning with numSeats: 2`}));       
    });

    test("should return 2 when one adult, child and infant tickets are requested", () => {
      expect(helper.calculateNumSeats([
        new TicketTypeRequest(TICKET_TYPE_ADULT, 1),
        new TicketTypeRequest(TICKET_TYPE_CHILD, 1),
        new TicketTypeRequest(TICKET_TYPE_INFANT, 1),
      ])).toBe(2);
      expect(logger.debug).toHaveBeenCalledTimes(2);
      expect(logger.debug).toHaveBeenNthCalledWith(1, expect.objectContaining({message: `In calculateNumSeats()`}));
      expect(logger.debug).toHaveBeenNthCalledWith(2, expect.objectContaining({message: `calculateNumSeats returning with numSeats: 2`}));       
    });

    test("should return 5 when two adults, three child and 2 infant tickets are requested", () => {
      expect(helper.calculateNumSeats([
        new TicketTypeRequest(TICKET_TYPE_ADULT, 2),
        new TicketTypeRequest(TICKET_TYPE_CHILD, 3),
        new TicketTypeRequest(TICKET_TYPE_INFANT, 2),
      ])).toBe(5);
      expect(logger.debug).toHaveBeenCalledTimes(2);
      expect(logger.debug).toHaveBeenNthCalledWith(1, expect.objectContaining({message: `In calculateNumSeats()`}));
      expect(logger.debug).toHaveBeenNthCalledWith(2, expect.objectContaining({message: `calculateNumSeats returning with numSeats: 5`}));       
    });

   test("should return 0 when a single infant is requested", () => {
      expect(helper.calculateNumSeats([
        new TicketTypeRequest(TICKET_TYPE_INFANT, 1),
      ])).toBe(0);
      expect(logger.debug).toHaveBeenCalledTimes(2);
      expect(logger.debug).toHaveBeenNthCalledWith(1, expect.objectContaining({message: `In calculateNumSeats()`}));
      expect(logger.debug).toHaveBeenNthCalledWith(2, expect.objectContaining({message: `calculateNumSeats returning with numSeats: 0`}));       
    });

   test("should return 0 when the ticket count per type is zero", () => {
      expect(helper.calculateNumSeats([
        new TicketTypeRequest(TICKET_TYPE_ADULT, 0),
        new TicketTypeRequest(TICKET_TYPE_CHILD, 0),
        new TicketTypeRequest(TICKET_TYPE_INFANT, 0),
      ])).toBe(0);
      expect(logger.debug).toHaveBeenCalledTimes(2);
      expect(logger.debug).toHaveBeenNthCalledWith(1, expect.objectContaining({message: `In calculateNumSeats()`}));
      expect(logger.debug).toHaveBeenNthCalledWith(2, expect.objectContaining({message: `calculateNumSeats returning with numSeats: 0`}));       
    });
  });  
});