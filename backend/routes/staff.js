// This file handles everything to do with managing Staff accounts:
// seeing the list, adding a new one, and turning accounts on/off.
// Only an Admin is allowed to do any of this.

const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { requireLogin, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// See the list of every staff/admin account.
router.get("/", requireLogin, requireAdmin, async (req, res) => {
  // We leave out passwordHash on purpose - nobody needs to see that, even an Admin.
  const staff = await User.find().select("-passwordHash").sort({ createdAt: -1 });
  res.json(staff);
});

// Create a brand new staff account.
router.post("/", requireLogin, requireAdmin, async (req, res) => {
  const { name, username, password, role } = req.body;

  if (!name || !username || !password) {
    return res.status(400).json({ message: "Please fill in all the fields." });
  }

  const alreadyExists = await User.findOne({ username });
  if (alreadyExists) {
    return res.status(409).json({ message: "That username is already taken." });
  }

  const scrambledPassword = await bcrypt.hash(password, 10);

  const newStaff = await User.create({
    name,
    username,
    passwordHash: scrambledPassword,
    role: role === "admin" ? "admin" : "staff",
    active: true,
  });

  res.status(201).json({
    id: newStaff._id,
    name: newStaff.name,
    username: newStaff.username,
    role: newStaff.role,
    active: newStaff.active,
  });
});

// Turn a staff account on or off. We never delete accounts, so old sales
// and restocks they made still show who did them.
router.put("/:id/toggle-active", requireLogin, requireAdmin, async (req, res) => {
  const staffMember = await User.findById(req.params.id);
  if (!staffMember) {
    return res.status(404).json({ message: "Couldn't find that staff account." });
  }

  staffMember.active = !staffMember.active;
  await staffMember.save();

  res.json({ id: staffMember._id, active: staffMember.active });
});

module.exports = router;
