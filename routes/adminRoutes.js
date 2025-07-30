const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getEmployeeQRCode,
} = require("../controllers/employeeController");

const router = express.Router();

/**
 * Employee Routes (Admin Access Only)
 * All these routes are protected and can only be accessed by admin users.
 */

// Create a new employee (Admin only)
router.post(
  "/employees",
  authenticate,
  roleMiddleware("admin"),
  createEmployee
);

// Get all employees (Admin only)
router.get(
  "/employees",
  authenticate,
  roleMiddleware("admin"),
  getAllEmployees
);

// Get a single employee by ID (Admin only)
router.get(
  "/employees/:id",
  authenticate,
  roleMiddleware("admin"),
  getEmployeeById
);

// Update employee details (Admin only)
router.put(
  "/employees/:id",
  authenticate,
  roleMiddleware("admin"),
  updateEmployee
);

// Delete an employee (Admin only)
router.delete(
  "/employees/:id",
  authenticate,
  roleMiddleware("admin"),
  deleteEmployee
);

module.exports = router;

// Get the QR code for a specific employee
// router.get("/qr/:id", authenticate, roleMiddleware("admin"), getEmployeeQRCode);