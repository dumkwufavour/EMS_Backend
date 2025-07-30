const {
  getPublicEmployeeProfile,
  searchEmployeesByName,
} = require("../services/publicService");

const getPublicEmployeeById = async (req, res, next) => {
  try {
    const token = req.query.token || "none";
    const ip = req.ip;

    console.log(
      `[PUBLIC SCAN] IP: ${ip}, Token: ${token}, EmployeeID: ${req.params.id}`
    );

    const employee = await getPublicEmployeeProfile(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(employee);
  } catch (err) {
    console.error("Error fetching public employee:", err);
    next(err);
  }
};

const searchEmployees = async (req, res) => {
  try {
    const { name, department, page = 1, limit = 10 } = req.query;

    if (!name) {
      return res.status(400).json({ message: "Name query is required" });
    }

    const result = await searchEmployeesByName({
      name,
      department,
      page,
      limit,
    });

    if (!result.data.length) {
      return res.status(404).json({ message: "No employees found." });
    }

    return res.json(result);
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({ message: "Server error during search." });
  }
};

module.exports = {
  getPublicEmployeeById,
  searchEmployees,
};

module.exports = { getPublicEmployeeById, searchEmployees };
