const { createClient } = require("redis");
const dotenv = require("dotenv");
dotenv.config();

let client;

/**
 * Initialize and connect to Redis client.
 * This should be called once at app startup.
 */
async function initRedis() {
  if (client) {
    console.warn("Redis client already initialized");
    return client;
  }

  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    throw new Error("REDIS_URL not found in environment variables");
  }

  client = createClient({ url: redisUrl });

  client.on("error", (err) => console.error("Redis Client Error:", err));

  await client.connect();

  console.log(`Connected to Redis at: ${redisUrl}`);

  return client;
}

/**
 * Disconnects the Redis client gracefully.
 */
async function quitRedis() {
  if (client) {
    await client.quit();
    client = null;
    console.log("Redis client disconnected");
  }
}

/**
 * Simple test function demonstrating set/get usage.
 */
async function testRedis() {
  try {
    const client = await initRedis();

    await client.set("foo", "bar");
    const value = await client.get("foo");
    console.log("Value from Redis:", value);

    await quitRedis();
  } catch (err) {
    console.error("Redis test failed:", err); 
  }
}

if (require.main === module) {
  // Run test if this file is executed directly
  testRedis();
}

// Export functions and client for reuse elsewhere in your app
module.exports = {
  initRedis,
  quitRedis,
  getClient: () => client,
};
