const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Employee = require("../models/employeeModel");
const { generateQRCode } = require("../utils/generateQRCode");
const logger = require("../utils/logger");
const { v4: uuidv4 } = require("uuid");
const { getClient } = require("../utils/redisClient");
// to use Redis for token blacklisting
// and session management

const login = async ({ email, password }) => {
  try {
    logger.info(`Login attempt for email: ${email}`);

    const user = await Employee.findOne({ email });
    if (!user) {
      logger.warn(`Login failed - user not found: ${email}`);
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.hashed_password
    );
    if (!isPasswordValid) {
      logger.warn(`Login failed - invalid password: ${email}`);
      throw new Error("Invalid credentials");
    }

    const jti = uuidv4(); // <- Unique identifier for the token

    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.is_admin,
        jti, // include jti in the payload
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY || "7d" }
    );

    logger.info(`Login successful for user ID: ${user._id}`);
    return token;
  } catch (error) {
    logger.error("Login error", { email, error: error.message });
    throw error;
  }
};

const getCurrentUser = async (token) => {
  if (!token) throw new Error("No token provided");

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new Error("Invalid token");
  }

  const user = await Employee.findById(decoded.id).select("-hashed_password");
  if (!user) throw new Error("User not found");

  return {
    id: user._id,
    email: user.email,
    full_name: user.full_name,
    isAdmin: user.is_admin,
    department: user.department,
    position: user.position,
    photo_url: user.photo_url,
    qr_code_url: user.qr_code_url,
  };
};

const updateAdmin = async (adminId, updates) => {
  try {
    logger.info(`Admin update requested for admin ID: ${adminId}`);

    const admin = await Employee.findById(adminId);
    if (!admin) {
      logger.warn(`Admin update failed - admin not found: ${adminId}`);
      throw new Error("Admin not found");
    }
    if (!admin.is_admin) {
      logger.warn(`Unauthorized admin update attempt by user ID: ${adminId}`);
      throw new Error("Unauthorized");
    }
    const fieldsToUpdate = {};
    const allowedFields = [
      "full_name",
      "email",
      "department",
      "position",
      "photo_url",
      "password",
    ];

    for (const field of allowedFields) {
      if (updates[field]) {
        if (field === "password") {
          const salt = await bcrypt.genSalt(10);
          fieldsToUpdate.hashed_password = await bcrypt.hash(
            updates.password,
            salt
          );
        } else {
          fieldsToUpdate[field] = updates[field];
        }
      }
    }

    if (Object.keys(fieldsToUpdate).length === 0) {
      logger.warn(`Admin update failed - no fields to update: ${adminId}`);
      throw new Error("No fields to update");
    }

    const updatedAdmin = await Employee.findByIdAndUpdate(
      adminId,
      { $set: fieldsToUpdate },
      { new: true }
    );

    const qrCode = await generateQRCode(updatedAdmin);
    updatedAdmin.qr_code_url = qrCode;
    await updatedAdmin.save();
    logger.info("Admin update payload:", updates);
    logger.info(`Admin updated successfully: ${adminId}`);

    const { full_name, email, department, position, photo_url, qr_code_url } =
      updatedAdmin;
    return {
      full_name,
      email,
      department,
      position,
      photo_url,
      qr_code_url,
    };
  } catch (error) {
    logger.error("Admin update error", { adminId, error: error.message });
    throw error;
  }
};

const logoutHandler = async (token) => {
  if (!token) {
    logger.warn("Logout attempt without token");
    throw new Error("No token found");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const { jti, ip, id, email, role } = decoded;
  const expiresInSeconds = decoded.exp - Math.floor(Date.now() / 1000);

  const redisClient = getClient();
  if (!redisClient) {
    logger.error("Redis client not initialized");
    throw new Error("Redis client not initialized");
  }

  const blacklistKey = `bl_${decoded.jti}`;
  await redisClient.setEx(blacklistKey, expiresInSeconds, "true");

  logger.info("Token blacklisted", {
    jti: decoded.jti,
    ip,
    userId: id,
    email,
    role,
  });

  return { id, email, role }; // return user info to controller
};

module.exports = { login, getCurrentUser, updateAdmin, logoutHandler };
// This code is part of the authService module, which handles authentication-related operations.
// It includes functions for user login and admin profile updates, with detailed logging for debugging and monitoring purposes.
