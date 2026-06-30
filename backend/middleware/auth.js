const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {

    console.log("=================================");
    console.log("AUTH HEADER:", req.headers.authorization);

    const token = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null;

    if (!token) {
      console.log("❌ No Token");

      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("✅ TOKEN DECODED:", decoded);

    req.user = await User.findById(decoded.id).select('-password');

    console.log("✅ USER FOUND:", req.user);

    if (!req.user) {
      console.log("❌ USER NOT FOUND");

      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    next();

  } catch (err) {

    console.log("❌ AUTH ERROR:", err);

    return res.status(401).json({
      success: false,
      message: 'Token invalid'
    });

  }
};

exports.adminOnly = (req, res, next) => {

  console.log("USER ROLE:", req.user?.role);

  if (req.user?.role !== 'admin') {

    console.log("❌ ADMIN ACCESS DENIED");

    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });

  }

  next();

};