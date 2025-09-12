# Cinema Tickets Purchase Service

Javascript service which allows cinema tickets to be purchased. The main logic is in the TicketService class, which accepts a numeric account id and an array of TicketTypeRequests. The ticket types are Adult, Child and Infant. The service will validate against business rules, calculate the total cost of the purchase and number of seats required, then call third party services to take payment and reserve seats. The service will return the total cost of the tickets plus the number of seats reserved.


## Business rules
- Three ticket types exist; Adult, Infant, Child.
- Each ticket type has a set price.
- Service input allows for multiple ticket types / number of tickets.
- Maximum number of tickets to be purchased is 25.
- Infants do not pay for a ticket.
- Infants do not require a seat as they will sit on an adults lap.
- An adult ticket must be purchased.

## External service rules
- The `TicketService` interface cannot be modified
- The `TicketService` will make calls to two existing third party services; `TicketPaymentService` to take payments and `SeatReservationService` to reserve the seats. 
- The internal logic and understanding of how these third party services work is out of scope.
- The `TicketTypeRequest` should be an immutable object
- Don't modify the existing thirdparty.* packages

## Assumptions made and coded against
- Account ID is of integer type and is valid when the value is great than zero.
- Minimum number of tickets to be purchased is 1 and maximum number is 25.
- There must be one Adult type present in the ticket purchase request.
- The number of infants cannot be greater than the number of adults.
- Only one of each ticket type in the request - no duplicates. Implies 3 TicketTypeRequests (Adult, Infant and Child).
- Payment service will be called prior to the seat reservation service. 
- Purchaser will always have enough funds - how the payment happens is outside of scope.
- Seats will always be reserved - how the seats are reserved is outside of scope.

## Futher clarity

The following would require clarifying with a Business Analyst in terms of behaviour
- The ratio of infants to adults does not explicitly state 1 infant per adult.


## Libraries used

- Linting - eslint 
- Testing - vitest
- Logging - winston


## Setup

The requirement to run the code / tests is to use Node LTS version **22.19.0** at time of creation

An `nvmrc` file is provided with the LTS version. Run the following command in the terminal:

```bash
nvm use
```

Install the packages and dependencies:

```bash
npm install
```

## Tests

The following will run the unit tests:

```bash
npm run test
```

The following will run the unit tests with the coverage report:
```bash
npm run test:coverage
```

## Linting

The following will run linting rules against the code:
```bash
npm run lint
```




## Usage
## Configuration -- log level
## Future improvements