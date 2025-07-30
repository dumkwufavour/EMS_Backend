const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");
const { getClient } = require("../utils/redisClient");

const authenticate = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];

  // 👉 Check for token in cookies if not in headers
  if (!token && req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    logger.warn("Authentication failed: No token provided", {
      method: req.method,
      url: req.originalUrl,
    });
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const redisClient = getClient();
    if (!redisClient) {
      logger.error("Redis client not initialized");
      return res.status(500).json({ message: "Internal server error" });
    }

    const blacklistKey = `bl_${decoded.jti || token}`;
    const isBlacklisted = await redisClient.get(blacklistKey);

    if (isBlacklisted) {
      logger.warn("Authentication failed: Token blacklisted", {
        userId: decoded.id,
      });
      return res.status(401).json({ message: "Token has been invalidated" });
    }

    req.user = { _id: decoded.id, is_admin: decoded.isAdmin };
    logger.info("Token verified successfully", {
      userId: decoded.id,
      isAdmin: decoded.isAdmin,
    });

    next();
  } catch (err) {
    logger.warn("Authentication failed: Invalid or expired token", {
      error: err.message,
    });
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authenticate;
