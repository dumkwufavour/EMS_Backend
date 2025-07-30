const logger = require("../utils/logger");

const roleMiddleware = (role) => (req, res, next) => {
  logger.info(`Checking role for user: is_admin=${req.user.is_admin}`);

  if (role === "admin" && req.user.is_admin !== true) {
    logger.warn(`Access denied. User does not have admin role.`);
    return res.status(403).json({ message: "You do not have permission" });
  }

  next();
};

module.exports = roleMiddleware;
