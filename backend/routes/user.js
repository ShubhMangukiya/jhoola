const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", authenticateToken, getUser);
router.get("/all", getAllUsers);
router.put("/update", updateUser);
router.delete("/delete", deleteUser);

module.exports = router;