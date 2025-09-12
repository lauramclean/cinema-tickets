import logger from '../utils/logger.js';
import { validateRequest } from '../helpers/ValidateRequest.js';
import { calculateNumSeats, calculateTotalCost } from '../helpers/CalculationHelper.js';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */

  purchaseTickets(accountId, ...ticketTypeRequests) {
    logger.debug({ message: "In purchaseTickets()" });

    try {
      validateRequest(accountId, ticketTypeRequests);

      const totalPrice = calculateTotalCost(ticketTypeRequests);
      const numSeats = calculateNumSeats(ticketTypeRequests);

      this.#makePayment(accountId, totalPrice);
      this.#reserveSeats(accountId, numSeats);

      logger.info({ message: `Booking successful. Total cost £${totalPrice} and ${numSeats} seats booked` });
      return { price: totalPrice, seatsReserved: numSeats }

    } catch (error) {
      logger.error({ message: `Purchase request unsuccessful: ${error?.message}`});
      throw new InvalidPurchaseException(`Purchase failed: ${error?.message}`);
    }
  }

  #makePayment(accountId, totalPrice) {
    new TicketPaymentService().makePayment(accountId, totalPrice);
  }

  #reserveSeats(accountId, numSeatsRequired) {
    new SeatReservationService().reserveSeat(accountId, numSeatsRequired);
  }
}