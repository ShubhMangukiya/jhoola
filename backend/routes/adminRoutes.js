const express = require("express");
const router = express.Router();
const authorize = require("../middleware/auth");

// Protect with role-based access
router.get("/admin/dashboard", authorize(["admin"]), (req, res) => {
  res.send("Welcome Admin");
});

module.exports = router;
