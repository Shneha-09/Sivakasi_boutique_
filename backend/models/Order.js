const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  guestInfo: { name: String, email: String, phone: String },
  items: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, name: String, image: String, price: Number, discountPrice: Number, quantity: Number, size: String, color: String }],
  shippingAddress: { fullName: String, phone: String, addressLine1: String, addressLine2: String, city: String, state: String, pincode: String },
  pricing: { subtotal: Number, discount: { type: Number, default: 0 }, shipping: { type: Number, default: 0 }, tax: { type: Number, default: 0 }, total: Number },
  paymentMethod: { type: String, enum: ['cod','online','upi'], default: 'cod' },
  paymentStatus: { type: String, enum: ['pending','paid','failed','refunded'], default: 'pending' },
  orderStatus: { type: String, enum: ['pending','confirmed','processing','shipped','delivered','cancelled','returned'], default: 'pending' },
  statusHistory: [{ status: String, note: String, updatedAt: { type: Date, default: Date.now } }],
  trackingNumber: String, courierName: String, notes: String, cancelReason: String
}, { timestamps: true });
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) { const count = await mongoose.model('Order').countDocuments(); this.orderNumber = `SB${Date.now().toString().slice(-6)}${(count+1).toString().padStart(3,'0')}`; }
  next();
});
module.exports = mongoose.model('Order', orderSchema);
