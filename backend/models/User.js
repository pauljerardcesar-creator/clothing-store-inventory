// This file describes what a "User" looks like in our database.
// Every user (whether Admin or Staff) is stored using this shape.

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // the person's real name
    username: { type: String, required: true, unique: true }, // used to log in
    passwordHash: { type: String, required: true }, // the password, scrambled for safety
    role: { type: String, enum: ["admin", "staff"], default: "staff" },
    // We never actually delete staff accounts - we just turn them off.
    // That way, old sales/restocks still show who did them.
    active: { type: Boolean, default: true },
  },
  { timestamps: true } // automatically remembers when each user was created
);

module.exports = mongoose.model("User", userSchema);
