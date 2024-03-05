const mongoose = require("mongoose");

const connectDB = () => {
  MONGO_DATABASE_BASE_URI = "mongodb://localhost:27017/google_calender_db";

  const DB_URI = process.env.MONGO_DATABASE_BASE_URI;

  try {
    mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
  const dbConnection = mongoose.connection;
  dbConnection.once("open", (_) => {
    console.log(`Database connected: ${DB_URI}`);
  });

  dbConnection.on("error", (err) => {
    console.error(`connection error: ${err}`);
  });
  return;
};

module.exports = connectDB;
