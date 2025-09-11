import { describe, test, vi, expect } from "vitest";

import * as helper from "../../../src/helpers/ValidateRequest.js";
import TicketTypeRequest from "../../../src/pairtest/lib/TicketTypeRequest";

describe("ValidateRequest helper functions", () => {
 
  //Validate account ID
  //Validate ticket type requests
  //Validate against business rules

  describe("Validate account ID", () => {
    test("should be defined", () => {
      expect(helper.validateAccountID).toBeDefined();
    });

    test("should throw an error when passing an accountID of null", () => {
      expect(() => helper.validateAccountID(null)).toThrowError(TypeError);
    });

    test("should throw an error when passing an accountID of undefined", () => {
      expect(() => helper.validateAccountID(undefined)).toThrowError(TypeError);
    });

    test("should throw an error when passing accountID of string type", () => {
      expect(() => helper.validateAccountID("1234")).toThrowError(TypeError);
    });

    test("should throw an error when passing accountID of decimal type", () => {
      expect(() => helper.validateAccountID(12.3)).toThrowError(TypeError);
    });

    test("should throw an error when passing an accountID with a negative value", () => {
      expect(() => helper.validateAccountID(-1)).toThrowError(TypeError);
    });

    test("should not throw an error when passing accountID where value is greater than zero", () => {
      expect(() => helper.validateAccountID(1)).not.toThrow();
    });

    test("should not throw an error when passing accountID where value is zero", () => {
      expect(() => helper.validateAccountID(0)).not.toThrow();
    });    
  });

  describe("Validate ticket type request", () => {
    test("should be defined", () => {
      expect(helper.validateTicketRequest).toBeDefined();
    });

    test("should throw an error when the TicketTypeRequest is not an array", () => {
      expect(() => helper.validateTicketRequest(null))
        .toThrowError("Invalid request type - requires at least 1 ticket request to be present");
    });

    test("should throw an error when the TicketTypeRequest is empty", () => {
      expect(() => helper.validateTicketRequest([]))
        .toThrowError("Invalid request type - requires at least 1 ticket request to be present");
    });

    test("should throw an error when the TicketTypeRequest exceeds the max number of items", () => {
      expect(() => helper.validateTicketRequest([
        new TicketTypeRequest("ADULT", 2),
        new TicketTypeRequest("ADULT", 2),
        new TicketTypeRequest("CHILD", 2),
        new TicketTypeRequest("INFANT", 2),
      ])).toThrowError("Number of ticket types exceeds maximum supported types");
    });

    test("should throw an error when the TicketTypeRequest contains duplicate types", () => {
      expect(() => helper.validateTicketRequest([
        new TicketTypeRequest("ADULT", 2),
        new TicketTypeRequest("ADULT", 2),
        new TicketTypeRequest("INFANT", 2),
      ])).toThrowError("Must only have one instance of each ticket type");
    });

    test("should throw an error when the TicketTypeRequest contains an invalid type", () => {
      expect(() => helper.validateTicketRequest([
        new TicketTypeRequest("ADULT", 2),
        new TicketTypeRequest("SENIOR", 1),
      ])).toThrowError("type must be ADULT, CHILD, or INFANT");
    });  

    test("should throw an error when the TicketTypeRequest contains 0 tickets", () => {
      expect(() => helper.validateTicketRequest([
        new TicketTypeRequest("ADULT", 2),
        new TicketTypeRequest("CHILD", 0),
        new TicketTypeRequest("INFANT", 0),
      ])).toThrowError("Expected at least one ticket");
    });

    test("should not throw an error when the TicketTypeRequest contains valid types and counts", () => {
      expect(() => helper.validateTicketRequest([
        new TicketTypeRequest("ADULT", 2),
        new TicketTypeRequest("CHILD", 2),
        new TicketTypeRequest("INFANT", 1),
      ])).not.toThrow();
    });
  });
});