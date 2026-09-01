// This file checks "is this person actually logged in?" before letting
// them use certain parts of the app. Think of it like a bouncer at a door.

const jwt = require("jsonwebtoken");

// Use this on any page/action that requires being logged in at all.
function requireLogin(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "You need to log in first." });
  }

  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // now the rest of the app knows who is asking
    next(); // let them continue
  } catch (error) {
    return res.status(401).json({ message: "Your session expired, please log in again." });
  }
}

// Use this ON TOP OF requireLogin for actions only Admins should do,
// like adding products or managing staff accounts.
function requireAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Only an Admin can do this." });
  }
  next();
}

module.exports = { requireLogin, requireAdmin };
