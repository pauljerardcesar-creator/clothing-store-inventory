// This file's only job is to connect our app to the database.
// Think of it like plugging in the phone line to the stockroom.

const mongoose = require("mongoose");

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to the database!");
  } catch (error) {
    console.log("Could not connect to the database:", error.message);
    process.exit(1); // stop the app, since nothing works without a database
  }
}

module.exports = connectToDatabase;
