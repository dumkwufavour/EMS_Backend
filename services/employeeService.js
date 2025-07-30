// services/employeeService.js
const Employee = require("../models/employeeModel");
const { generateQRCode } = require("../utils/generateQRCode");
const bcrypt = require("bcrypt");
const logger = require("../utils/logger");
const {getClient} = require("../utils/redisClient")

const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const createEmployee = async (data) => {
  try {
    const {
      full_name,
      email,
      password,
      department,
      position,
      photo_url,
      is_admin,
    } = data;

    if (!password || typeof password !== "string") {
      logger.warn("Invalid or missing password during employee creation");
      throw new Error("Password is required");
    }

    const existing = await Employee.findOne({ email });
    if (existing) {
      logger.warn(`Duplicate email registration attempt: ${email}`);
      throw new Error("Email already in use");
    }

    const hashedPassword = await hashPassword(password);
    const newEmployee = new Employee({
      full_name,
      email,
      hashed_password: hashedPassword,
      department,
      position,
      photo_url,
      is_admin: is_admin || false,
    });

    newEmployee.qr_code_url = await generateQRCode(newEmployee);
    const savedEmployee = await newEmployee.save();
    logger.info(`Employee created: ${email}`);

    return savedEmployee;
  } catch (err) {
    logger.error("Error in createEmployee", err);
    throw err;
  }
};

const getAllEmployees = async () => {
  try {
    const employees = await Employee.find().select("-hashed_password");
    logger.info("Fetched all employees");
    return employees;
  } catch (err) {
    logger.error("Error in getAllEmployees", err);
    throw err;
  }
};

const getEmployeeById = async (id) => {
  try {
    const employee = await Employee.findById(id).select("-hashed_password");
    if (!employee) {
      logger.warn(`Employee not found: ${id}`);
    } else {
      logger.info(`Fetched employee by ID: ${id}`);
    }
    return employee;
  } catch (err) {
    logger.error("Error in getEmployeeById", err);
    throw err;
  }
};

const updateEmployee = async (employeeId, updaterId, isAdmin, data) => {
  try {
    if (employeeId !== updaterId && !isAdmin) {
      logger.warn(
        `Unauthorized update attempt by ${updaterId} for ${employeeId}`
      );
      throw new Error("Not authorized to update this employee");
    }

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      logger.warn(`Employee not found for update: ${employeeId}`);
      throw new Error("Employee not found");
    }

    const fieldsToUpdate = {};
    ["full_name", "email", "department", "position", "photo_url"].forEach(
      (f) => {
        if (data[f]) fieldsToUpdate[f] = data[f];
      }
    );

    if (isAdmin && typeof data.is_admin !== "undefined") {
      fieldsToUpdate.is_admin = data.is_admin;
    }

    const updated = await Employee.findByIdAndUpdate(
      employeeId,
      { $set: fieldsToUpdate },
      { new: true }
    );

    updated.qr_code_url = await generateQRCode(updated);
    const saved = await updated.save();

    // ✅ Invalidate Redis cache
    const redisClient = getClient();
    if (redisClient) {
      await redisClient.del(`employee:public:${employeeId}`);
      logger.info(`Invalidated Redis cache for employee ${employeeId}`);
    }

    logger.info(`Updated employee: ${employeeId}`);
    return saved;
  } catch (err) {
    logger.error("Error in updateEmployee", err);
    throw err;
  }
};

const deleteEmployee = async (id) => {
  try {
    const deleted = await Employee.findByIdAndDelete(id);
    if (!deleted) {
      logger.warn(`Attempted to delete non-existent employee: ${id}`);
      throw new Error("Employee not found");
    }

    logger.info(`Deleted employee: ${id}`);
    return true;
  } catch (err) {
    logger.error("Error in deleteEmployee", err);
    throw err;
  }
};

const getQRCode = async (idOrEmployee) => {
  try {
    const result = await generateQRCode(idOrEmployee);
    logger.info(
      `Generated QR code for: ${
        typeof idOrEmployee === "string" ? idOrEmployee : idOrEmployee._id
      }`
    );
    return result;
  } catch (err) {
    logger.error("Error in getQRCode", err);
    throw err;
  }
};

const getAuthenticatedEmployee = async (id) => {
  try {
    const employee = await Employee.findById(id).select("-hashed_password");
    if (!employee) {
      logger.warn(`Authenticated employee not found: ${id}`);
    } else {
      logger.info(`Fetched authenticated employee: ${id}`);
    }
    return employee;
  } catch (err) {
    logger.error("Error in getAuthenticatedEmployee", err);
    throw err;
  }
};

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getQRCode,
  getAuthenticatedEmployee,
};
