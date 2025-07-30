const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI).then(() => {
      console.log("✅ MongoDB connected");
      console.log("Connected to DB:", mongoose.connection.name);
    });
    // List all collections in the database
    mongoose.connection.db.listCollections().toArray((err, collections) => {
      if (err) {
        console.error("Error listing collections:", err);
      } else {
        console.log("Collections: ");
        collections.forEach((col) => console.log(" -", col.name));
      }
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
