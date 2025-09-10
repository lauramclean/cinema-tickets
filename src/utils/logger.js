import { createLogger, format, transports } from 'winston';
import config from '../../config.js';

const { combine, timestamp, errors } = format;

/* eslint-disable */
const logFormat = format.printf((entry) => {
  return `${entry.timestamp} - ${entry.level.toUpperCase()}: ${entry.message}`;
});

// Create a new logger instance with the level as defined by the environment variable
const logger = createLogger({
  format: combine(
    timestamp(),
    errors({ stack: true }),
    logFormat,
  ),
  transports: [new transports.Console({ level: config.logLevel })],
});

export default logger;