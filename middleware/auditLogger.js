// middlewares/auditLogger.js
const logger = require("../utils/logger");

const getClientIp = (req) => {
  return (
    req.headers["x-forwarded-for"]?.split(",").shift() ||
    req.socket?.remoteAddress ||
    req.ip
  );
};

const auditLogger = (req, res, next) => {
  const ip = getClientIp(req);
  const userId = req.user?._id || "anonymous";
  const method = req.method;
  const path = req.originalUrl;
  const timestamp = new Date().toISOString();

  logger.info("User operation logged", {
    timestamp,
    userId,
    ip,
    method,
    path,
  });

  next();
};

module.exports = auditLogger;
