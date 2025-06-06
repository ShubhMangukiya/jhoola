const User = require("../model/user");

// Admin Dashboard example
exports.dashboard = (req, res) => {
  res.json({ message: `Welcome Admin ${req.user.email}` });
};