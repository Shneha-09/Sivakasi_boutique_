const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const signToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || '30d'
    }
  );
};

// =======================
// Register
// =======================
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all required fields'
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase()
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone
    });

    res.status(201).json({
      success: true,
      token: signToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error("Register Error:", err);

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});


// =======================
// Login
// =======================
router.post('/login', async (req, res) => {
  try {

    const { email, password } = req.body;

    console.log("--------------------------------");
    console.log("Login Attempt");
    console.log("Entered Email:", email);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required"
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase()
    });

    if (!user) {
      console.log("❌ User not found");

      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    console.log("✅ User Found");
    console.log("Database Email:", user.email);
    console.log("Role:", user.role);

    const isMatch = await user.comparePassword(password);

    console.log("Password Match:", isMatch);

    if (!isMatch) {
      console.log("❌ Wrong Password");

      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    if (!user.isActive) {
      console.log("❌ Account Disabled");

      return res.status(403).json({
        success: false,
        message: "Account disabled"
      });
    }

    console.log("✅ Login Successful");

    res.status(200).json({
      success: true,
      token: signToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {

    console.error("Login Error:", err);

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});


// =======================
// Current User
// =======================
router.get('/me', protect, async (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});


// =======================
// Update Profile
// =======================
router.put('/profile', protect, async (req, res) => {

  try {

    const { name, phone, addresses } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        name,
        phone,
        addresses
      },
      {
        new: true
      }
    ).select('-password');

    res.json({
      success: true,
      user
    });

  } catch (err) {

    console.error("Profile Update Error:", err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

});

module.exports = router;