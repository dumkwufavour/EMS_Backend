const Employee = require("../models/employeeModel");
const { getClient } = require("../utils/redisClient");

async function getPublicEmployeeProfile(id) {
  const redisClient = getClient();
  const cacheKey = `employee:public:${id}`;

  if (!redisClient) {
    console.warn("Redis client not initialized, fetching directly from DB");
    // fallback if Redis not connected
    return await Employee.findById(id).select(
      "full_name department position photo_url"
    );
  }

  try {
    // Try to fetch from cache
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // Fetch from DB
    const employee = await Employee.findById(id).select(
      "full_name department position photo_url"
    );

    if (!employee) return null;

    // Cache the result for 1 hour (3600 seconds)
    await redisClient.set(cacheKey, JSON.stringify(employee), {
      EX: 3600,
    });

    return employee;
  } catch (error) {
    console.error("Error accessing Redis or DB:", error);
    // fallback to DB on error
    return await Employee.findById(id).select(
      "full_name department position photo_url"
    );
  }
}

async function searchEmployeesByName({ name, department, page, limit }) {
  const redisClient = getClient();
  const deptKey = department || "all";
  const cacheKey = `employee:smartSearch:${name}:${deptKey}:${page}:${limit}`;

  if (redisClient) {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log("🔁 Redis HIT:", cacheKey);
      return JSON.parse(cached);
    }
  }

  const skip = (page - 1) * limit;

  const nameRegex = new RegExp(name, "i"); // case-insensitive
  const query = {
    full_name: nameRegex,
  };
  if (department) query.department = department;

  // First: check for exact match
  const exactMatch = await Employee.findOne({
    full_name: name,
    ...(department && { department }),
  }).select("full_name department position photo_url");

  let results;

  if (exactMatch) {
    results = [exactMatch];
  } else {
    // fallback to all partial matches
    results = await Employee.find(query)
      .select("full_name department position photo_url")
      .skip(skip)
      .limit(limit);
  }

  const total = await Employee.countDocuments(query);

  const response = {
    data: results,
    page: Number(page),
    limit: Number(limit),
    total,
    totalPages: Math.ceil(total / limit),
  };

  if (redisClient) {
    await redisClient.set(cacheKey, JSON.stringify(response), { EX: 3600 });
    console.log("💾 Redis SET:", cacheKey);
  }

  return response;
}

module.exports = { getPublicEmployeeProfile, searchEmployeesByName };
