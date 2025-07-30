const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const Employee = require("../models/employeeModel");
const { updateEmployee, getAuthenticatedEmployee} = require("../controllers/employeeController");
const { logout } = require("../controllers/authController");

const router = express.Router();

/**
 * Employee Routes
 * These routes are accessible to authenticated users.
 */

// Get the current authenticated user's details
router.get("/me", authenticate, getAuthenticatedEmployee);
router.put("/me", authenticate, updateEmployee);
router.post("/me/logout=true", authenticate, logout);

module.exports = router;
