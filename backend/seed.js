// This is a one-time helper script. Run it ONCE to create your very first
// Admin account, since you need at least one Admin to be able to log in
// and create everyone else.
//
// How to run it: open a terminal in the "backend" folder and type:
//   node seed.js

const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const connectToDatabase = require("./db");
const User = require("./models/User");

dotenv.config();

async function createFirstAdmin() {
  await connectToDatabase();

  const alreadyExists = await User.findOne({ username: "admin" });
  if (alreadyExists) {
    console.log("An admin account already exists - nothing to do!");
    process.exit(0);
  }

  const scrambledPassword = await bcrypt.hash("ChangeMe123!", 10);

  await User.create({
    name: "Store Manager",
    username: "admin",
    passwordHash: scrambledPassword,
    role: "admin",
    active: true,
  });

  console.log("Done! You can now log in with:");
  console.log("username: admin");
  console.log("password: ChangeMe123!");
  console.log("(Please change this password later in a real deployment.)");

  await mongoose.disconnect();
  process.exit(0);
}

createFirstAdmin();
