// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const User = require('../model/user');

// // REGISTER
// exports.register = async (req, res) => {
//   const { firstName, lastName, email, password } = req.body;

//   if (!firstName || !lastName || !email || !password) {
//     return res.status(400).json({ message: 'All fields are required' });
//   }

//   try {
//     const existingUser = await User.findOne({ where: { email } });
//     if (existingUser) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     await User.create({
//       firstName,
//       lastName,
//       email,
//       password: hashedPassword,
//     });

//     return res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     console.error('Registration Error:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// };

// exports.login = async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ message: "Email and password are required" });
//   }

//   try {
//     const user = await User.findOne({ where: { email } });

//     if (!user) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     // Reject if the user is not an admin
//     if (user.role !== 'admin') {
//       return res.status(403).json({ message: 'Access denied: Admins only' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     if (!process.env.JWT_SECRET) {
//       return res.status(500).json({ message: 'JWT secret is not configured' });
//     }

//     const token = jwt.sign(
//       { id: user.id, email: user.email, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '1d' }
//     );

//     return res.status(200).json({
//       message: 'Login successful',
//       value: {
//         token,
//         user: {
//           id: user.id,
//           email: user.email,
//           role: user.role,
//         },
//       },
//     });
//   } catch (error) {
//     console.error('Login Error:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// };



const User = require("../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (user) => {
  return jwt.sign(
    { userId: user.userId || null, email: user.email, role: user.role },
    process.env.JWT_SECRET
  );
};

const signup = async (req, res) => {
  try {
    console.log("body", req.body);

    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password should required" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.log("Email already exists");
      return res.status(500).json({ message: "Email Already Exists" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashPassword,
    });
    res.status(200).json(newUser);
    console.log("User Created");
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Error creating user" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    console.log("user", user);

    if (!user) {
      return res.status(401).json({ message: "User Not Registered..." });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = generateToken(user);
    const userData = {
      ...user.dataValues,
      token: token,
    };

    await User.update(
      {
        token: token,
      },
      { where: { userId: user.userId } }
    );

    res.status(200).json({ message: "Login Successful", user: userData });
    console.log("Login Successful", token);
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
    console.log(error);
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({
      where: { userId },
      attributes: { exclude: ["password", "token"] },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ message: "Error fetching user" });
  }
};


const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params; // <-- change from req.user to req.params
    const { phone, dob, firstName, lastName } = req.body;

    let profileImg = null;
    if (req.file) {
      profileImg = req.file.filename; // Get the image filename
    }

    if (!phone && !dob && !firstName && !lastName && !profileImg) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const updateData = {};
    if (phone) updateData.phone = phone;
    if (dob) updateData.dob = dob;
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (profileImg) updateData.profileImg = profileImg;

    const [updated] = await User.update(updateData, {
      where: { userId },
    });

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await User.findOne({
      where: { userId },
      attributes: { exclude: ["password", "token"] },
    });

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res
      .status(500)
      .json({ message: "Error updating profile", error: error.message });
  }
};


const logout = async (req, res) => {
  try {
    res.status(200).json({ message: "Logged Out Successful" });
    console.log("Loggged Out...");
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error logging out", error: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users data" });
  }
};

module.exports = { signup, login, logout, getUsers, updateProfile,getUserById};
