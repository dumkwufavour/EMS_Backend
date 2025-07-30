const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors"); // <-- import cors here

const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const adminRoutes = require("./routes/adminRoutes");
const errorHandler = require("./middleware/errorMiddleware");
const authenticate = require("./middleware/authMiddleware");
const auditLogger = require("./middleware/auditLogger");
const requestLogger = require("./middleware/requestLogger");
const { initRedis } = require("./utils/redisClient");
const cookieParser = require("cookie-parser"); // <-- import cookie-parser

const publicRoutes = require("./routes/publicRoutes");

dotenv.config();
const app = express();

app.use(cookieParser()); // <-- add cookie-parser middleware

const allowedOrigins = [
  "http://localhost:3000",
  // "https://gbf-portal.vercel.app",
  // "https://gbf-ems.onrender.com",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
};
app.use(cors(corsOptions));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

initRedis().catch((err) => {
  console.error("Failed to connect to Redis", err);
  process.exit(1);
});

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/public", publicRoutes);

app.use(requestLogger);
app.use(authenticate);
app.use(auditLogger);
app.use(errorHandler);

module.exports = app;