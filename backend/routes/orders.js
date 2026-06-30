const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', async (req, res) => {
  try {
    const { items, shippingAddress, pricing, paymentMethod, guestInfo, userId } = req.body;
    const orderData = { items, shippingAddress, pricing, paymentMethod, guestInfo, statusHistory: [{ status: 'pending', note: 'Order placed' }] };
    if (userId) orderData.user = userId;
    for (const item of items) { await Product.findOneAndUpdate({ _id: item.product, 'sizes.size': item.size }, { $inc: { 'sizes.$.stock': -item.quantity } }); }
    const order = await Order.create(orderData);
    res.status(201).json({ success: true, order });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/my', protect, async (req, res) => {
  try { const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }); res.json({ success: true, orders }); }
  catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/track/:orderNumber', async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const query = {};
    if (status) query.orderStatus = status;
    if (search) query.orderNumber = { $regex: search, $options: 'i' };
    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([Order.find(query).populate('user', 'name email').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)), Order.countDocuments(query)]);
    res.json({ success: true, orders, total, pages: Math.ceil(total / Number(limit)) });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/admin/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { orderStatus, note, trackingNumber, courierName } = req.body;
    const update = { orderStatus };
    if (trackingNumber) update.trackingNumber = trackingNumber;
    if (courierName) update.courierName = courierName;
    const order = await Order.findByIdAndUpdate(req.params.id, { ...update, $push: { statusHistory: { status: orderStatus, note: note || '' } } }, { new: true });
    res.json({ success: true, order });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.user?.toString() !== req.user._id.toString() && req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'Not authorized' });
    res.json({ success: true, order });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
