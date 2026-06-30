const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  description: { type: String, required: true },
  shortDescription: { type: String },
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  images: [{ type: String }],
  category: { type: String, required: true, enum: ['womens-kurtis','nighties','womens-innerwear','mens-innerwear'] },
  subCategory: { type: String },
  sizes: [{ size: String, stock: { type: Number, default: 0 } }],
  colors: [String],
  fabric: { type: String },
  brand: { type: String, default: 'Sivakasi Boutique' },
  tags: [String],
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  isBestSeller: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  ratings: { average: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
  reviews: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, name: String, rating: Number, comment: String, createdAt: { type: Date, default: Date.now } }],
  seoTitle: String, seoDescription: String, seoKeywords: [String],
  totalStock: { type: Number, default: 0 }
}, { timestamps: true });
productSchema.pre('save', function(next) { if (this.sizes?.length) this.totalStock = this.sizes.reduce((s, i) => s + (i.stock || 0), 0); next(); });
module.exports = mongoose.model('Product', productSchema);
