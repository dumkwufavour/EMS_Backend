const { createLogger, format, transports } = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");

const { combine, timestamp, printf, colorize, errors, metadata } = format;

// Format for file logs (no color)
const fileFormat = printf(({ timestamp, level, message, stack, metadata }) => {
  const metaString =
    metadata && Object.keys(metadata).length
      ? ` | meta: ${JSON.stringify(metadata)}`
      : "";
  return `${timestamp} [${level}] ${stack || message}${metaString}`;
});

// Format for console logs (with color)
const consoleFormat = printf(
  ({ timestamp, level, message, stack, metadata }) => {
    const metaString =
      metadata && Object.keys(metadata).length
        ? ` | meta: ${JSON.stringify(metadata)}`
        : "";
    return `${timestamp} [${level}]: ${stack || message}${metaString}`;
  }
);

const logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(
    errors({ stack: true }),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    metadata({ fillExcept: ["message", "level", "timestamp", "label"] })
  ),
  transports: [
    new transports.Console({
      format: combine(colorize(), consoleFormat),
    }),
    new DailyRotateFile({
      filename: "logs/error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      level: "error",
      maxFiles: "14d",
      zippedArchive: true,
      format: fileFormat,
    }),
    new DailyRotateFile({
      filename: "logs/combined-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
      zippedArchive: true,
      format: fileFormat,
    }),
  ],
  exitOnError: false,
});

module.exports = logger;
