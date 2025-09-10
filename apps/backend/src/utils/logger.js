const winston = require('winston');
const path = require('path');

// Define log levels
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

// Define log colors
const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue'
};

winston.addColors(logColors);

// Create log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf((info) => {
    const { timestamp, level, message, stack } = info;
    return `${timestamp} [${level}]: ${stack || message}`;
  })
);

// Create transports
const transports = [
  // Console transport
  new winston.transports.Console({
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.NODE_ENV === 'production' ? logFormat : consoleFormat
  })
];

// Add file transport in production
if (process.env.NODE_ENV === 'production') {
  // Defensive check for LOG_FILE_PATH - ensure it's a valid string before using path.dirname
  let logDir = './logs'; // Default fallback
  if (process.env.LOG_FILE_PATH && typeof process.env.LOG_FILE_PATH === 'string' && process.env.LOG_FILE_PATH.trim()) {
    try {
      logDir = path.dirname(process.env.LOG_FILE_PATH);
    } catch (error) {
      console.warn('Invalid LOG_FILE_PATH provided, using default ./logs directory:', error.message);
      logDir = './logs';
    }
  }
  
  transports.push(
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      format: logFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      format: logFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  );
}

// Create logger instance
const logger = winston.createLogger({
  levels: logLevels,
  format: logFormat,
  transports,
  exitOnError: false
});

// Stream for Morgan middleware
logger.stream = {
  write: (message) => {
    logger.http(message.trim());
  }
};

module.exports = { logger };