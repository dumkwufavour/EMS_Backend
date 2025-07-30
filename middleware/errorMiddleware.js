const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  const isProd = process.env.NODE_ENV === "production";

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Handle known Mongoose/JWT errors
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Resource not found with ID: ${err.value}`;
  } else if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  } else if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate field value entered for: ${field}`;
  } else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please log in again.";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Your session has expired. Please log in again.";
  }

  logger.error("❌ Error Handler Triggered", {
    statusCode,
    method: req.method,
    url: req.originalUrl,
    message,
    stack: isProd ? undefined : err.stack,
    user: req.user?._id || null,
  });

  res.status(statusCode).json({
    success: false,
    message,
    stack: isProd ? undefined : err.stack,
  });
};

module.exports = errorHandler;
