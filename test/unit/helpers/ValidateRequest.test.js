import { describe, test, vi, beforeEach, afterAll, expect } from "vitest";

import logger from "../../../src/utils/logger.js";
import * as helper from "../../../src/helpers/ValidateRequest.js";
import TicketTypeRequest from "../../../src/pairtest/lib/TicketTypeRequest";

describe("ValidateRequest helper functions", () => {
 
  beforeEach(() => {
    vi.spyOn(logger, "debug");
  });

  afterAll(() => {
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
      expect(() => helper.validateAccountID(null)).toThrowError("Invalid account ID - must be greater than 0");
      expect(logger.debug).toHaveBeenCalledTimes(1);
    });

    test("should throw an error when passing an accountID of undefined", () => {
      expect(() => helper.validateAccountID(undefined)).toThrowError("Invalid account ID - must be greater than 0");
      expect(logger.debug).toHaveBeenCalledTimes(1);
    });

    test("should throw an error when passing accountID of string type", () => {
      expect(() => helper.validateAccountID("1234")).toThrowError("Invalid account ID - must be greater than 0");
      expect(logger.debug).toHaveBeenCalledTimes(1);
    });

    test("should throw an error when passing accountID of decimal type", () => {
      expect(() => helper.validateAccountID(12.3)).toThrowError("Invalid account ID - must be greater than 0");
      expect(logger.debug).toHaveBeenCalledTimes(1);
    });

    test("should throw an error when passing an accountID with a negative value", () => {
      expect(() => helper.validateAccountID(-1)).toThrowError("Invalid account ID - must be greater than 0");
      expect(logger.debug).toHaveBeenCalledTimes(1);
    });

    test("should not throw an error when passing accountID where value is greater than zero", () => {
      expect(() => helper.validateAccountID(1)).not.toThrow();
      expect(logger.debug).toHaveBeenCalledTimes(1);
    });

    test("should not throw an error when passing accountID where value is zero", () => {
      expect(() => helper.validateAccountID(0)).not.toThrow();
      expect(logger.debug).toHaveBeenCalledTimes(1);      
    });    
  });

  describe("Validate ticket type request", () => {
    test("should be defined", () => {
      expect(helper.validateTicketRequest).toBeDefined();
    });

    test("should throw an error when the TicketTypeRequest is not an array", () => {
      expect(() => helper.validateTicketRequest(null))
        .toThrowError("Invalid request type - requires at least 1 ticket request to be present");
      expect(logger.debug).toHaveBeenCalledTimes(1);        
    });

    test("should throw an error when the TicketTypeRequest is empty", () => {
      expect(() => helper.validateTicketRequest([]))
        .toThrowError("Invalid request type - requires at least 1 ticket request to be present");
      expect(logger.debug).toHaveBeenCalledTimes(1);         
    });

    test("should throw an error when the TicketTypeRequest contains duplicate types", () => {
      expect(() => helper.validateTicketRequest([
        new TicketTypeRequest("ADULT", 2),
        new TicketTypeRequest("ADULT", 2),
        new TicketTypeRequest("INFANT", 2),
      ])).toThrowError("Must only have one instance of each ticket type");
      expect(logger.debug).toHaveBeenCalledTimes(1);       
    });

    test("should throw an error when the TicketTypeRequest contains an invalid type", () => {
      expect(() => helper.validateTicketRequest([
        new TicketTypeRequest("ADULT", 2),
        new TicketTypeRequest("SENIOR", 1),
      ])).toThrowError("type must be ADULT, CHILD, or INFANT");     
    });

    test("should throw an error when the request array does not contain a TicketRequestType", () => {
      expect(() => helper.validateTicketRequest([
        "ADULT"
      ])).toThrowError("Should be of TicketTypeRequest type");
      expect(logger.debug).toHaveBeenCalledTimes(1);      
    });  

    test("should throw an error when the TicketTypeRequest contains 0 tickets", () => {
      expect(() => helper.validateTicketRequest([
        new TicketTypeRequest("ADULT", 2),
        new TicketTypeRequest("CHILD", 0),
        new TicketTypeRequest("INFANT", 0),
      ])).toThrowError("Expected at least one ticket");
      expect(logger.debug).toHaveBeenCalledTimes(1);      
    });

    test("should not throw an error when the TicketTypeRequest contains valid types and counts", () => {
      expect(() => helper.validateTicketRequest([
        new TicketTypeRequest("ADULT", 2),
        new TicketTypeRequest("CHILD", 2),
        new TicketTypeRequest("INFANT", 1),
      ])).not.toThrow();
      expect(logger.debug).toHaveBeenCalledTimes(1);      
    });
  });

  describe("Validate ticket rules", () => {
    test("should be defined", () => {
      expect(helper.validatePurchaseTypeRules).toBeDefined();
    });

    test("should throw an error when no Adult ticket is requested", () => {
      expect(() => helper.validatePurchaseTypeRules([
        new TicketTypeRequest("CHILD", 2)
      ])).toThrowError('Requires at least 1 adult to be present');
      expect(logger.debug).toHaveBeenCalledTimes(1);       
    });

    test("should throw an error when no Adult ticket is requested", () => {
      expect(() => helper.validatePurchaseTypeRules([
        new TicketTypeRequest("CHILD", 2),
        new TicketTypeRequest("INFANT", 2)        
      ])).toThrowError('Requires at least 1 adult to be present');
      expect(logger.debug).toHaveBeenCalledTimes(1);      
    });

    test("should not throw an error when a single Adult ticket is requested", () => {
      expect(() => helper.validatePurchaseTypeRules([
        new TicketTypeRequest("ADULT", 1)
      ])).not.toThrow();
      expect(logger.debug).toHaveBeenCalledTimes(1);      
    }); 

     test("should not throw an error when an adult and child ticket is requested", () => {
      expect(() => helper.validatePurchaseTypeRules([
        new TicketTypeRequest("ADULT", 1),
        new TicketTypeRequest("CHILD", 1)        
      ])).not.toThrow();
      expect(logger.debug).toHaveBeenCalledTimes(1);      
    }); 

    test("should not throw an error when an adult and infant ticket is requested", () => {
      expect(() => helper.validatePurchaseTypeRules([
        new TicketTypeRequest("ADULT", 1),
        new TicketTypeRequest("INFANT", 1)        
      ])).not.toThrow();
      expect(logger.debug).toHaveBeenCalledTimes(1);      
    }); 

    test("should throw an error when number of infants is greater than number of adults", () => {
      expect(() => helper.validatePurchaseTypeRules([
        new TicketTypeRequest("ADULT", 1),
        new TicketTypeRequest("INFANT", 2)        
      ])).toThrowError('Requires at least 1 adult per infant to be present');
      expect(logger.debug).toHaveBeenCalledTimes(1);      
    });     
   
    test("should not throw an error when number of infants is less than number of adults", () => {
      expect(() => helper.validatePurchaseTypeRules([
        new TicketTypeRequest("ADULT", 1),
        new TicketTypeRequest("INFANT", 1)        
      ])).not.toThrow();
      expect(logger.debug).toHaveBeenCalledTimes(1);      
    });

    test("should not throw an error when number of infants is less than number of adults", () => {
      expect(() => helper.validatePurchaseTypeRules([
        new TicketTypeRequest("ADULT", 2),
        new TicketTypeRequest("INFANT", 1)        
      ])).not.toThrow();
      expect(logger.debug).toHaveBeenCalledTimes(1);      
    });  

    test("should not throw an error when number of infants is equal to number of adults", () => {
      expect(() => helper.validatePurchaseTypeRules([
        new TicketTypeRequest("ADULT", 2),
        new TicketTypeRequest("INFANT", 2)        
      ])).not.toThrow();
      expect(logger.debug).toHaveBeenCalledTimes(1);      
    });

    test("should throw an error when total number of tickets is zero", () => {
      expect(() => helper.validatePurchaseTypeRules([
        new TicketTypeRequest("ADULT", 0),
        new TicketTypeRequest("INFANT", 0), 
        new TicketTypeRequest("CHILD", 0),               
      ])).toThrowError('Must have at least one ticket or maximum of 25 tickets');
      expect(logger.debug).toHaveBeenCalledTimes(1);      
    });      

    test("should throw an error when total number of tickets is greater than 25", () => {
      expect(() => helper.validatePurchaseTypeRules([
        new TicketTypeRequest("ADULT", 25),
        new TicketTypeRequest("INFANT", 3), 
        new TicketTypeRequest("CHILD", 4),               
      ])).toThrowError('Must have at least one ticket or maximum of 25 tickets');
      expect(logger.debug).toHaveBeenCalledTimes(1);      
    });

    test("should throw an error when total number of tickets is negative", () => {
      expect(() => helper.validatePurchaseTypeRules([
        new TicketTypeRequest("ADULT", -1),
        new TicketTypeRequest("INFANT", -1), 
        new TicketTypeRequest("CHILD", -1),               
      ])).toThrowError("Must have at least one ticket or maximum of 25 tickets");
      expect(logger.debug).toHaveBeenCalledTimes(1);      
    });

    test("should not throw an error when total number of tickets is 25", () => {
      expect(() => helper.validatePurchaseTypeRules([
        new TicketTypeRequest("ADULT", 23),
        new TicketTypeRequest("INFANT", 1), 
        new TicketTypeRequest("CHILD", 1),               
      ])).not.toThrow();
      expect(logger.debug).toHaveBeenCalledTimes(1);      
    });
  });

  describe("ValidateRequest tests", () => {
    test("should pass validation", () => {
      expect(() => helper.validateRequest(123, [
        new TicketTypeRequest("ADULT", 2)
      ])).not.toThrow()
      expect(logger.debug).toHaveBeenCalledTimes(4);
    });

    test("should fail account id validation", () => {

      try {
        helper.validateRequest(0, [new TicketTypeRequest("ADULT", 2)]);
      } catch (error) {
        expect(error.message).toEqual("Invalid account ID - must be greater than 0");
      }

      expect(logger.debug).toHaveBeenCalledTimes(2);
    });

    test("should fail ticket type validation", () => {

      try {
        helper.validateRequest(0, []);
      } catch (error) {
        expect(error.message).toEqual("Invalid request type - requires at least 1 ticket request to be present");
      }

      expect(logger.debug).toHaveBeenCalledTimes(3);
    });

    test("should fail ticket rules validation", () => {

      try {
        helper.validateRequest(0, [new TicketTypeRequest("INFANT", 1)]);
      } catch (error) {
        expect(error.message).toEqual("Requires at least 1 adult to be present");
      }

      expect(logger.debug).toHaveBeenCalledTimes(4);
    });      
  });
});