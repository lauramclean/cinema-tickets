import { describe, test, vi, expect } from "vitest";

import * as helper from "../../../src/helpers/ValidateRequest.js";

describe("ValidateRequest helper functions", () => {
 
  //Validate account ID
  //Validate ticket type requests
  //Validate against business rules

  describe("Validate account ID", () => {
    test("should be defined", () => {
      expect(helper.validateAccountID).toBeDefined();
    });

    test("should throw an error when passing an accountID of null", () => {
      expect(() => helper.validateAccountID(null)).toThrow();
    });

    test("should throw an error when passing an accountID of undefined", () => {
      expect(() => helper.validateAccountID(undefined)).toThrow();
    });

    test("should throw an error when passing accountID of string type", () => {
      expect(() => helper.validateAccountID("1234")).toThrow();
    });

    test("should throw an error when passing an accountID with a negative value", () => {
      expect(() => helper.validateAccountID(-1)).toThrow();
    });

    test("should not throw an error when passing accountID where value is greater than zero", () => {
      expect(() => helper.validateAccountID(1)).not.toThrow();
    });

    test("should not throw an error when passing accountID where value is zero", () => {
      expect(() => helper.validateAccountID(0)).not.toThrow();
    });    
  });
});