const getClientIp = require("../utils/clientIp");
const getRequestOrigin = require("../utils/getRequestOrigin");
const logger = require("../utils/logger");

const SLOW_REQUEST_THRESHOLD_MS = 2000; // 2 seconds

const requestLogger = (req, res, next) => {
  const startTime = process.hrtime();

  res.on("finish", () => {
    const duration = process.hrtime(startTime);
    const durationMs = (duration[0] * 1e9 + duration[1]) / 1e6;

    const meta = {
      ip: getClientIp(req),
      userId: req.user?._id || "anonymous",
      method: req.method,
      url: req.originalUrl || req.url,
      statusCode: res.statusCode,
      origin: getRequestOrigin(req),
      userAgent: req.headers["user-agent"],
      durationMs,
    };

    if (
      req.originalUrl.includes("/login") &&
      durationMs > SLOW_REQUEST_THRESHOLD_MS
    ) {
      logger.warn("🚨 Slow login detected", meta);
    }

    logger.info("Request completed", meta);
  });

  next();
};

module.exports = requestLogger;
