const authService = require("../services/authService");
const logger = require("../utils/logger");
const getClientIp = require("../utils/clientIp");
const getRequestOrigin = require("../utils/getRequestOrigin");

const login = async (req, res, next) => {
  const startTime = process.hrtime();
  const ip = getClientIp(req);
  const origin = getRequestOrigin(req);
  const userAgent = req.headers["user-agent"];

  try {
    const token = await authService.login(req.body);

    const duration = process.hrtime(startTime);
    const durationMs = (duration[0] * 1e9 + duration[1]) / 1e6;

    logger.info("User logged in", {
      ip,
      email: req.body.email,
      origin,
      userAgent,
      durationMs,
    });

    console.log("🔍 Incoming Cookies:", req.cookies);

    // Set the JWT token as an HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.json({ token });
  } catch (error) {
    const duration = process.hrtime(startTime);
    const durationMs = (duration[0] * 1e9 + duration[1]) / 1e6;

    logger.error("Login failed", {
      ip,
      error,
      origin,
      userAgent,
      durationMs,
    });

    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token" });
    }

    const user = await authService.getCurrentUser(token);

    return res.status(200).json(user);
  } catch (error) {
    if (
      error.message === "No token provided" ||
      error.message === "Invalid token" ||
      error.message === "User not found"
    ) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    next(error);
  }
};

const updateAdmin = async (req, res, next) => {
  const startTime = process.hrtime();
  const ip = getClientIp(req);
  const origin = getRequestOrigin(req);
  const userAgent = req.headers["user-agent"];

  try {
    const updatedAdminData = await authService.updateAdmin(
      req.user._id,
      req.body
    );

    const duration = process.hrtime(startTime);
    const durationMs = (duration[0] * 1e9 + duration[1]) / 1e6;

    logger.info("Admin profile updated", {
      ip,
      userId: req.user._id,
      origin,
      userAgent,
      durationMs,
    });

    res.status(200).json(updatedAdminData);
  } catch (error) {
    const duration = process.hrtime(startTime);
    const durationMs = (duration[0] * 1e9 + duration[1]) / 1e6;

    logger.error("Admin update failed", {
      ip,
      error,
      origin,
      userAgent,
      durationMs,
    });

    next(error);
  }
};

const logout = async (req, res, next) => {
  const startTime = process.hrtime();
  const ip = getClientIp(req);
  const origin = getRequestOrigin(req);
  const userAgent = req.headers["user-agent"];

  try {
    const token =
      req.cookies.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    if (!token) {
      logger.warn("Logout request received with no token");
      return res.status(401).json({ error: "Unauthorized: No token" });
    }

    await authService.logoutHandler(token);

    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    const duration = process.hrtime(startTime);
    const durationMs = (duration[0] * 1e9 + duration[1]) / 1e6;

    logger.info("User logged out", {
      ip,
      userId: req.user?._id,
      origin,
      userAgent,
      durationMs,
    });

    res.status(200).json({ success: true, message: "Logout successful" });
  } catch (error) {
    logger.error("Error during logout", {
      error: error.message,
      ip,
      origin,
      userAgent,
    });
    next(error);
  }
};

module.exports = { login, getCurrentUser, updateAdmin, logout };
