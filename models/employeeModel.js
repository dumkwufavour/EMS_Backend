const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    full_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    hashed_password: { type: String, required: true },
    department: { type: String },
    position: { type: String },
    photo_url: { type: String },
    is_admin: { type: Boolean, default: false },
    qr_code_url: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Employees", employeeSchema, "employee");
