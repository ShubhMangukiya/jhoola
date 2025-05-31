const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    console.log("Signup request:", { firstName, lastName, email });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ firstName, lastName, email, password: hashedPassword });
    res.status(201).json({ message: "User created successfully", userId: user.id });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(400).json({ message: "Email already exists or invalid data", error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log("Login request:", { email });
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log("User not found:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch for:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined");
      return res.status(500).json({ message: "Server configuration error" });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log("Login successful for:", email);
    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    console.log("Fetching user profile for ID:", req.user?.id);
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized: No user ID provided" });
    }
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ["password"] } });
    if (!user) {
      console.log("User not found:", req.user.id);
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Error fetching user", error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  const adminEmail = "admin";
  const adminPassword = "admin123";
  const { email, password } = req.query;

  if (!email || !password) {
    return res.status(400).json({ message: "Admin email and password are required" });
  }

  if (email !== adminEmail || password !== adminPassword) {
    console.log("Credentials mismatch:", { email, password });
    return res.status(401).json({ message: "Unauthorized: Invalid admin credentials" });
  }

  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });
    res.json(users);
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ message: "Error fetching all users", error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  const { userId, firstName, lastName, email } = req.body;
  const { email: adminEmail, password } = req.query;

  const adminEmailCheck = "admin";
  const adminPasswordCheck = "admin123";
  if (!adminEmail || !password) {
    return res.status(400).json({ message: "Admin email and password are required" });
  }

  if (adminEmail !== adminEmailCheck || password !== adminPasswordCheck) {
    return res.status(401).json({ message: "Unauthorized: Invalid admin credentials" });
  }

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.update({ firstName, lastName, email });
    res.json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  const { userId } = req.body;
  const { email, password } = req.query;

  const adminEmail = "admin";
  const adminPassword = "admin123";
  if (!email || !password) {
    return res.status(400).json({ message: "Admin email and password are required" });
  }

  if (email !== adminEmail || password !== adminPassword) {
    return res.status(401).json({ message: "Unauthorized: Invalid admin credentials" });
  }

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};