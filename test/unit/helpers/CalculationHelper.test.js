import { describe, test, expect } from "vitest";

import * as helper from "../../../src/helpers/CalculationHelper.js"
import TicketTypeRequest from "../../../src/pairtest/lib/TicketTypeRequest";

describe("Calculation helper functions", () => {
 
  //Calculate total cost
  //Calculate seats required

  describe("Calculate total cost", () => {
    test("should be defined", () => {
      expect(helper.calculateTotalCost).toBeDefined();
    });

    test("should return 0 when ticket type request is empty", () => {
      expect(helper.calculateTotalCost([])).toBe(0);
    });

    test("should return 25 when a single adult tickets are requested", () => {
      expect(helper.calculateTotalCost([
        new TicketTypeRequest("ADULT", 1)
      ])).toBe(25);
    });

    test("should return 50 when two adult tickets are requested", () => {
      expect(helper.calculateTotalCost([
        new TicketTypeRequest("ADULT", 2)
      ])).toBe(50);
    });

    test("should return 40 when one adult ticket plus one child tickets are requested", () => {
      expect(helper.calculateTotalCost([
        new TicketTypeRequest("ADULT", 1),
        new TicketTypeRequest("CHILD", 1)        
      ])).toBe(40);
    });

    test("should return 40 when one adult, child and infant tickets are requested", () => {
      expect(helper.calculateTotalCost([
        new TicketTypeRequest("ADULT", 1),
        new TicketTypeRequest("CHILD", 1),
        new TicketTypeRequest("INFANT", 1),
      ])).toBe(40);
    });

    test("should return 95 when two adults, three child and 2 infant tickets are requested", () => {
      expect(helper.calculateTotalCost([
        new TicketTypeRequest("ADULT", 2),
        new TicketTypeRequest("CHILD", 3),
        new TicketTypeRequest("INFANT", 2),
      ])).toBe(95);
    });

   test("should return 0 when a single infant is requested", () => {
      expect(helper.calculateTotalCost([
        new TicketTypeRequest("INFANT", 1),
      ])).toBe(0);
    });

   test("should return 0 when the ticket count per type is zero", () => {
      expect(helper.calculateTotalCost([
        new TicketTypeRequest("ADULT", 0),
        new TicketTypeRequest("CHILD", 0),
        new TicketTypeRequest("INFANT", 0),
      ])).toBe(0);
    });
  });

  describe("Calculate number of seats", () => {
    test("should be defined", () => {
      expect(helper.calculateNumSeats).toBeDefined();
    });

    test("should return zero when ticket type request is empty", () => {
      expect(helper.calculateNumSeats([])).toBe(0);
    });

    test("should return 1 when a single adult tickets are requested", () => {
      expect(helper.calculateNumSeats([
        new TicketTypeRequest("ADULT", 1)
      ])).toBe(1);
    });

    test("should return 2 when two adult tickets are requested", () => {
      expect(helper.calculateNumSeats([
        new TicketTypeRequest("ADULT", 2)
      ])).toBe(2);
    });

    test("should return 2 when one adult ticket plus one child tickets are requested", () => {
      expect(helper.calculateNumSeats([
        new TicketTypeRequest("ADULT", 1),
        new TicketTypeRequest("CHILD", 1)        
      ])).toBe(2);
    });

    test("should return 2 when one adult, child and infant tickets are requested", () => {
      expect(helper.calculateNumSeats([
        new TicketTypeRequest("ADULT", 1),
        new TicketTypeRequest("CHILD", 1),
        new TicketTypeRequest("INFANT", 1),
      ])).toBe(2);
    });

    test("should return 5 when two adults, three child and 2 infant tickets are requested", () => {
      expect(helper.calculateNumSeats([
        new TicketTypeRequest("ADULT", 2),
        new TicketTypeRequest("CHILD", 3),
        new TicketTypeRequest("INFANT", 2),
      ])).toBe(5);
    });

   test("should return 0 when a single infant is requested", () => {
      expect(helper.calculateNumSeats([
        new TicketTypeRequest("INFANT", 1),
      ])).toBe(0);
    });

   test("should return 0 when the ticket count per type is zero", () => {
      expect(helper.calculateNumSeats([
        new TicketTypeRequest("ADULT", 0),
        new TicketTypeRequest("CHILD", 0),
        new TicketTypeRequest("INFANT", 0),
      ])).toBe(0);
    });
  });  
});