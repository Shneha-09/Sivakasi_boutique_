const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const [totalOrders, monthOrders, totalRevenue, monthRevenue, totalProducts, totalUsers, pendingOrders, recentOrders, ordersByStatus, topProducts] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Order.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$pricing.total' } } }]),
      Order.aggregate([{ $match: { paymentStatus: 'paid', createdAt: { $gte: startOfMonth } } }, { $group: { _id: null, total: { $sum: '$pricing.total' } } }]),
      Product.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'user' }),
      Order.countDocuments({ orderStatus: 'pending' }),
      Order.find().populate('user', 'name').sort({ createdAt: -1 }).limit(5),
      Order.aggregate([{ $group: { _id: '$orderStatus', count: { $sum: 1 } } }]),
      Order.aggregate([{ $unwind: '$items' }, { $group: { _id: '$items.product', name: { $first: '$items.name' }, totalSold: { $sum: '$items.quantity' }, revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } }, { $sort: { totalSold: -1 } }, { $limit: 5 }])
    ]);
    res.json({ success: true, stats: { totalOrders, monthOrders, totalRevenue: totalRevenue[0]?.total || 0, monthRevenue: monthRevenue[0]?.total || 0, totalProducts, totalUsers, pendingOrders }, recentOrders, ordersByStatus, topProducts });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
