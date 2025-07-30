const express = require("express");
const { getPublicEmployeeById, searchEmployees } = require("../controllers/publicController");

const router = express.Router();

router.get("/employee/:id", getPublicEmployeeById);
router.get("/employees/search", searchEmployees);

module.exports = router;
