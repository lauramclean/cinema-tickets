import { describe, test, vi, beforeEach, afterEach, expect } from "vitest";

import { TICKET_TYPE_ADULT, TICKET_TYPE_CHILD, TICKET_TYPE_INFANT } from "../../../src/utils/constants.js";
import * as errors from "../../../src/utils/errors.js";
import logger from "../../../src/utils/logger.js";
import * as helper from "../../../src/helpers/ValidateRequest.js";
import TicketTypeRequest from "../../../src/pairtest/lib/TicketTypeRequest";

describe("ValidateRequest helper functions", () => {
 
  beforeEach(() => {
    vi.spyOn(logger, "debug");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  //Validate account ID
  //Validate ticket type requests
  //Validate against business rules

  describe("Validate account ID", () => {
    test("should be defined", () => {
      expect(helper.validateAccountID).toBeDefined();
    });

    test("should throw an error when passing an accountID of null", () => {
      expect(() => helper.validateAccountID(null)).toThrowError(errors.ACCOUNT_ID_ERROR);
      expect(logger.debug).toHaveBeenCalledTimes(1);
    });

    test("should throw an error when passing an accountID of undefined", () => {
      expect(() => helper.validateAccountID(undefined)).toThrowError(errors.ACCOUNT_ID_ERROR);
      expect(logger.debug).toHaveBeenCalledTimes(1);
    });

    test("should throw an error when passing accountID of string type", () => {
      expect(() => helper.validateAccountID("1234")).toThrowError(errors.ACCOUNT_ID_ERROR);
      expect(logger.debug).toHaveBeenCalledTimes(1);
    });

    test("should throw an error when passing accountID of decimal type", () => {
      expect(() => helper.validateAccountID(12.3)).toThrowError(errors.ACCOUNT_ID_ERROR);
      expect(logger.debug).toHaveBeenCalledTimes(1);
    });

    test("should throw an error when passing an accountID with a negative value", () => {
      expect(() => helper.validateAccountID(-1)).toThrowError(errors.ACCOUNT_ID_ERROR);
      expect(logger.debug).toHaveBeenCalledTimes(1);
    });

    test("should not throw an error when passing accountID where value is greater than zero", () => {
      expect(() => helper.validateAccountID(1)).not.toThrow();
      expect(logger.debug).toHaveBeenCalledTimes(1);
    });

    test("should throw an error when passing accountID where value is zero", () => {
      expect(() => helper.validateAccountID(0)).toThrowError(errors.ACCOUNT_ID_ERROR);
      expect(logger.debug).toHaveBeenCalledTimes(1);      
    });    
  });

  describe("Validate ticket type request", () => {
    test("should be defined", () => {
      expect(helper.validateTicketRequest).toBeDefined();
    });

    test("should throw an error when the TicketTypeRequest is not an array", () => {
      expect(() => helper.validateTicketRequest(null))
        .toThrowError(errors.REQUEST_ARRAY_ERROR);
      expect(logger.debug).toHaveBeenCalledTimes(1);        
    });

    test("should throw an error when the TicketTypeRequest is empty", () => {
      expect(() => helper.validateTicketRequest([]))
        .toThrowError(errors.REQUEST_ARRAY_ERROR);
      expect(logger.debug).toHaveBeenCalledTimes(1);         
    });

    test("should throw an error when the TicketTypeRequest contains duplicate types", () => {
      expect(() => helper.validateTicketRequest([
        new TicketTypeRequest(TICKET_TYPE_ADULT, 2),
        new TicketTypeRequest(TICKET_TYPE_ADULT, 2),
        new TicketTypeRequest(TICKET_TYPE_INFANT, 2),
      ])).toThrowError(errors.DUPLICATE_TICKET_ERROR);
      expect(logger.debug).toHaveBeenCalledTimes(1);       
    });

    test("should throw an error when the TicketTypeRequest contains an invalid type", () => {
      expect(() => helper.validateTicketRequest([
        new TicketTypeRequest(TICKET_TYPE_ADULT, 2),
        new TicketTypeRequest("SENIOR", 1),
      ])).toThrowError("type must be ADULT, CHILD, or INFANT");     
    });

    test("should throw an error when the request array does not contain a TicketRequestType", () => {
      expect(() => helper.validateTicketRequest([
        TICKET_TYPE_ADULT
      ])).toThrowError(errors.INVALID_TYPE_REQUEST_ERROR);
      expect(logger.debug).toHaveBeenCalledTimes(1);      
    });  

    test("should throw an error when the TicketTypeRequest contains 0 tickets", () => {
      expect(() => helper.validateTicketRequest([
        new TicketTypeRequest(TICKET_TYPE_ADULT, 2),
        new TicketTypeRequest(TICKET_TYPE_CHILD, 0),
        new TicketTypeRequest(TICKET_TYPE_INFANT, 0),
      ])).toThrowError(errors.MIN_TICKET_COUNT_ERROR);
      expect(logger.debug).toHaveBeenCalledTimes(1);      
    });

    test("should not throw an error when the TicketTypeRequest contains valid types and counts", () => {
      expect(() => helper.validateTicketRequest([
        new TicketTypeRequest(TICKET_TYPE_ADULT, 2),
        new TicketTypeRequest(TICKET_TYPE_CHILD, 2),
        new TicketTypeRequest(TICKET_TYPE_INFANT, 1),
      ])).not.toThrow();
      expect(logger.debug).toHaveBeenCalledTimes(1);      
    });
  });

  describe("Validate ticket rules", () => {
    test("should be defined", () => {
      expect(helper.validatePurchaseTypeRules).toBeDefined();
    });

    test("should throw an error when a single child ticket is requested without an adult", () => {
      expect(() => helper.validatePurchaseTypeRules([
        new TicketTypeRequest(TICKET_TYPE_CHILD, 2)
      ])).toThrowError(errors.REQUIRES_ADULT_ERROR);
      expect(logger.debug).toHaveBeenCalledTimes(1);       
    });

    test("should throw an error when a child plus infant tickets are requested without an adult", () => {
      expect(() => helper.validatePurchaseTypeRules([
        new TicketTypeRequest(TICKET_TYPE_CHILD, 2),
        new TicketTypeRequest(TICKET_TYPE_INFANT, 2)        
      ])).toThrowError(errors.REQUIRES_ADULT_ERROR);
      expect(logger.debug).toHaveBeenCalledTimes(1);      
    });

    test("should not throw an error when a single Adult ticket is requested", () => {
      expect(() => helper.validatePurchaseTypeRules([
        new TicketTypeRequest(TICKET_TYPE_ADULT, 1)
      ])).not.toThrow();
      expect(logger.debug).toHaveBeenCalledTimes(1);      
    }); 

     test("should not throw an error when an adult and child ticket is requested", () => {
      expect(() => helper.validatePurchaseTypeRules([
        new TicketTypeRequest(TICKET_TYPE_ADULT, 1),
        new TicketTypeRequest(TICKET_TYPE_CHILD, 1)        
      ])).not.toThrow();
      expect(logger.debug).toHaveBeenCalledTimes(1);      
    }); 

    test("should not throw an error when an adult and infant ticket is requested", () => {
      expect(() => helper.validatePurchaseTypeRules([
        new TicketTypeRequest(TICKET_TYPE_ADULT, 1),
        new TicketTypeRequest(TICKET_TYPE_INFANT, 1)        
      ])).not.toThrow();
      expect(logger.debug).toHaveBeenCalledTimes(1);      
    }); 

    test("should throw an error when number of infants is greater than number of adults", () => {
      expect(() => helper.validatePurchaseTypeRules([
        new TicketTypeRequest(TICKET_TYPE_ADULT, 1),
        new TicketTypeRequest(TICKET_TYPE_INFANT, 2)        
      ])).toThrowError(errors.INFANT_RULE_ERROR);
      expect(logger.debug).toHaveBeenCalledTimes(1);      
    });     
   
    test("should not throw an error when number of infants is less than number of adults", () => {
      expect(() => helper.validatePurchaseTypeRules([
        new TicketTypeRequest(TICKET_TYPE_ADULT, 1),
        new TicketTypeRequest(TICKET_TYPE_INFANT, 1)        
      ])).not.toThrow();
      expect(logger.debug).toHaveBeenCalledTimes(1);      
    });

    test("should not throw an error when number of infants is less than number of adults", () => {
      expect(() => helper.validatePurchaseTypeRules([
        new TicketTypeRequest(TICKET_TYPE_ADULT, 2),
        new TicketTypeRequest(TICKET_TYPE_INFANT, 1)        
      ])).not.toThrow();
      expect(logger.debug).toHaveBeenCalledTimes(1);      
    });  

    test("should not throw an error when number of infants is equal to number of adults", () => {
      expect(() => helper.validatePurchaseTypeRules([
        new TicketTypeRequest(TICKET_TYPE_ADULT, 2),
        new TicketTypeRequest(TICKET_TYPE_INFANT, 2)        
      ])).not.toThrow();
      expect(logger.debug).toHaveBeenCalledTimes(1);      
    });

    test("should throw an error when total number of tickets is zero", () => {
      expect(() => helper.validatePurchaseTypeRules([
        new TicketTypeRequest(TICKET_TYPE_ADULT, 0),
        new TicketTypeRequest(TICKET_TYPE_INFANT, 0), 
        new TicketTypeRequest(TICKET_TYPE_CHILD, 0),               
      ])).toThrowError(errors.TICKET_COUNT_RANGE_ERROR);
      expect(logger.debug).toHaveBeenCalledTimes(1);      
    });      

    test("should throw an error when total number of tickets is greater than 25", () => {
      expect(() => helper.validatePurchaseTypeRules([
        new TicketTypeRequest(TICKET_TYPE_ADULT, 25),
        new TicketTypeRequest(TICKET_TYPE_INFANT, 3), 
        new TicketTypeRequest(TICKET_TYPE_CHILD, 4),               
      ])).toThrowError(errors.TICKET_COUNT_RANGE_ERROR);
      expect(logger.debug).toHaveBeenCalledTimes(1);      
    });

    test("should throw an error when total number of tickets is negative", () => {
      expect(() => helper.validatePurchaseTypeRules([
        new TicketTypeRequest(TICKET_TYPE_ADULT, -1),
        new TicketTypeRequest(TICKET_TYPE_INFANT, -1), 
        new TicketTypeRequest(TICKET_TYPE_CHILD, -1),               
      ])).toThrowError(errors.TICKET_COUNT_RANGE_ERROR);
      expect(logger.debug).toHaveBeenCalledTimes(1);      
    });

    test("should not throw an error when total number of tickets is 25", () => {
      expect(() => helper.validatePurchaseTypeRules([
        new TicketTypeRequest(TICKET_TYPE_ADULT, 23),
        new TicketTypeRequest(TICKET_TYPE_INFANT, 1), 
        new TicketTypeRequest(TICKET_TYPE_CHILD, 1),               
      ])).not.toThrow();
      expect(logger.debug).toHaveBeenCalledTimes(1);      
    });
  });

  describe("ValidateRequest tests", () => {
    test("should pass validation", () => {
      expect(() => helper.validateRequest(123, [
        new TicketTypeRequest(TICKET_TYPE_ADULT, 2)
      ])).not.toThrow()
      expect(logger.debug).toHaveBeenCalledTimes(4);
    });

    test("should fail account id validation", () => {

      try {
        helper.validateRequest(0, [new TicketTypeRequest(TICKET_TYPE_ADULT, 2)]);
      } catch (error) {
        expect(error.message).toEqual(errors.ACCOUNT_ID_ERROR);
      }

      expect(logger.debug).toHaveBeenCalledTimes(2);
    });

    test("should fail ticket type validation", () => {

      try {
        helper.validateRequest(1, []);
      } catch (error) {
        expect(error.message).toEqual(errors.TICKET_REQUEST_ARRAY_ERROR);
      }

      expect(logger.debug).toHaveBeenCalledTimes(3);
    });

    test("should fail ticket rules validation", () => {

      try {
        helper.validateRequest(1, [new TicketTypeRequest(TICKET_TYPE_INFANT, 1)]);
      } catch (error) {
        expect(error.message).toEqual(errors.REQUIRES_ADULT_ERROR);
      }

      expect(logger.debug).toHaveBeenCalledTimes(4);
    });      
  });
});