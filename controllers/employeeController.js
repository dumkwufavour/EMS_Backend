const employeeService = require("../services/employeeService");
const logger = require("../utils/logger");
const getClientIp = require("../utils/clientIp");
const getRequestOrigin = require("../utils/getRequestOrigin");

const createEmployee = async (req, res, next) => {
  const ip = getClientIp(req);
  const origin = getRequestOrigin(req);
  try {
    logger.info("Creating employee", {
      email: req.body.email,
      ip,
      userId: req.user._id,
      origin,
    });

    const employee = await employeeService.createEmployee(req.body);

    logger.info("Employee created", {
      id: employee._id,
      ip,
      userId: req.user._id,
      origin,
    });
    res.status(201).json(employee);
  } catch (err) {
    logger.error("Error in createEmployee", {
      error: err.message,
      ip,
      userId: req.user._id,
      origin,
    });
    next(err);
  }
};

// Similarly update other controller methods:

const getAllEmployees = async (req, res, next) => {
  const ip = getClientIp(req);
  const origin = getRequestOrigin(req);
  try {
    logger.info("Fetching all employees", { ip, userId: req.user._id, origin });

    const employees = await employeeService.getAllEmployees();

    logger.info(`Fetched ${employees.length} employees`, {
      ip,
      userId: req.user._id,
      origin,
    });
    res.json(employees);
  } catch (err) {
    logger.error("Error in getAllEmployees", {
      error: err.message,
      ip,
      userId: req.user._id,
      origin,
    });
    next(err);
  }
};

const getEmployeeById = async (req, res, next) => {
  const ip = getClientIp(req);
  const origin = getRequestOrigin(req);
  try {
    logger.info("Fetching employee by ID", {
      id: req.params.id,
      ip,
      userId: req.user._id,
      origin,
    });

    const employee = await employeeService.getEmployeeById(req.params.id);

    if (!employee) {
      logger.warn("Employee not found", {
        id: req.params.id,
        ip,
        userId: req.user._id,
        origin,
      });
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json(employee);
  } catch (err) {
    logger.error("Error in getEmployeeById", {
      error: err.message,
      ip,
      userId: req.user._id,
      origin,
    });
    next(err);
  }
};

const updateEmployee = async (req, res, next) => {
  const ip = getClientIp(req);
  const origin = getRequestOrigin(req);
  try {
    const targetId = req.params.id || req.user._id;

    logger.info("Updating employee", {
      targetId,
      updaterId: req.user._id,
      isAdmin: req.user.is_admin,
      ip,
      origin,
    });

    const updated = await employeeService.updateEmployee(
      targetId,
      req.user._id,
      req.user.is_admin,
      req.body
    );

    logger.info("Employee updated", {
      id: updated._id,
      ip,
      userId: req.user._id,
      origin,
    });
    res.json(updated);
  } catch (err) {
    logger.error("Error in updateEmployee", {
      error: err.message,
      ip,
      userId: req.user._id,
      origin,
    });
    next(err);
  }
};

const deleteEmployee = async (req, res, next) => {
  const ip = getClientIp(req);
  const origin = getRequestOrigin(req); 
  try {
    logger.info("Deleting employee", {
      id: req.params.id,
      ip,
      userId: req.user._id,
      origin,
    });

    await employeeService.deleteEmployee(req.params.id);

    logger.info("Employee deleted", {
      id: req.params.id,
      ip,
      userId: req.user._id,
      origin,
    });
    res.status(200).json({ success: true, message: "Employee deleted" });
  } catch (err) {
    logger.error("Error in deleteEmployee", {
      error: err.message,
      ip,
      userId: req.user._id,
      origin,
    });
    next(err);
  }
};

const getEmployeeQRCode = async (req, res, next) => {
  const ip = getClientIp(req);
  const origin = getRequestOrigin(req);
  try {
    logger.info("Fetching QR code for employee", {
      id: req.params.id,
      ip,
      userId: req.user._id,
      origin, 
    });

    const qr = await employeeService.getQRCode(req.params.id);
    res.status(200).json({ qr });
  } catch (err) {
    logger.error("Error in getEmployeeQRCode", {
      error: err.message,
      ip,
      userId: req.user._id,
      origin,
    });
    next(err);
  }
};

const getAuthenticatedEmployee = async (req, res, next) => {
  const ip = getClientIp(req);
  const origin = getRequestOrigin(req);
  try {
    logger.info("Fetching authenticated employee", { id: req.user._id, ip, origin });

    const employee = await employeeService.getAuthenticatedEmployee(
      req.user._id
    );
    res.json({ ...employee.toObject(), qr_code_url: employee.qr_code_url });
  } catch (err) {
    logger.error("Error in getAuthenticatedEmployee", {
      error: err.message,
      ip,
      userId: req.user._id,
      origin,
    });
    next(err);
  }
};

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getEmployeeQRCode,
  getAuthenticatedEmployee,
};
