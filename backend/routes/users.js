const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = { role: 'user' };
    if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([User.find(query).select('-password').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)), User.countDocuments(query)]);
    res.json({ success: true, users, total, pages: Math.ceil(total / Number(limit)) });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/:id/toggle', protect, adminOnly, async (req, res) => {
  try { const user = await User.findById(req.params.id); user.isActive = !user.isActive; await user.save(); res.json({ success: true, user }); }
  catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
