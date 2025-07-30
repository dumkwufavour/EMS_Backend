const express = require("express");
const { login, updateAdmin, getCurrentUser, logout } = require("../controllers/authController");
const authenticate = require("../middleware/authMiddleware");


const router = express.Router();

/**
 * Auth Routes
 * Handles user authentication via login.
 */

// User login route
router.post("/login", login);
router.put("/me", authenticate, updateAdmin);
router.get("/me", authenticate, getCurrentUser);

// Admin & employee logout route
router.post("/me/logout=true", authenticate, logout);

module.exports = router;
