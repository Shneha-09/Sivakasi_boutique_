const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const slugify = require('slugify');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

// ================== MULTER ==================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `product-${Date.now()}${path.extname(file.originalname)}`
    );
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

// ================== IMAGE UPLOAD ==================

router.post(
  '/upload',
  protect,
  adminOnly,
  upload.single('image'),
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No image uploaded'
        });
      }

      res.json({
        success: true,
        url: `/uploads/${req.file.filename}`
      });

    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }
);

// ================== GET PRODUCTS ==================

router.get('/', async (req, res) => {
  try {

    const {
      category,
      search,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 12,
      featured,
      bestSeller,
      newArrival
    } = req.query;

    const query = {
      isActive: true
    };

    if (category) query.category = category;
    if (featured === 'true') query.isFeatured = true;
    if (bestSeller === 'true') query.isBestSeller = true;
    if (newArrival === 'true') query.isNewArrival = true;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const sortMap = {
      'price-asc': { price: 1 },
      'price-desc': { price: -1 },
      newest: { createdAt: -1 },
      popular: { 'ratings.count': -1 }
    };

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sortMap[sort] || { createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),

      Product.countDocuments(query)
    ]);

    res.json({
      success: true,
      products,
      total,
      pages: Math.ceil(total / Number(limit)),
      page: Number(page)
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
});

// ================== ADMIN PRODUCTS ==================

router.get('/admin/all', protect, adminOnly, async (req, res) => {

  try {

    const {
      page = 1,
      limit = 20,
      category,
      search
    } = req.query;

    const query = {};

    if (category) query.category = category;

    if (search) {
      query.name = {
        $regex: search,
        $options: 'i'
      };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([

      Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),

      Product.countDocuments(query)

    ]);

    res.json({
      success: true,
      products,
      total,
      pages: Math.ceil(total / Number(limit))
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

});

// ================== SINGLE PRODUCT ==================

router.get('/:slug', async (req, res) => {

  try {

    const product = await Product.findOne({
      slug: req.params.slug,
      isActive: true
    });

    if (!product) {

      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });

    }

    res.json({
      success: true,
      product
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

});

// ================== CREATE PRODUCT ==================

router.post(
  '/',
  protect,
  adminOnly,
  upload.array('images', 5),
  async (req, res) => {

    try {

      const data = { ...req.body };

      if (req.files && req.files.length > 0) {

        data.images = req.files.map(
          file => `/uploads/${file.filename}`
        );

      } else if (req.body.images) {

        data.images =
          typeof req.body.images === 'string'
            ? JSON.parse(req.body.images)
            : req.body.images;

      }

      data.slug =
        slugify(data.name, {
          lower: true,
          strict: true
        }) +
        '-' +
        Date.now();

      if (typeof data.sizes === 'string')
        data.sizes = JSON.parse(data.sizes);

      if (typeof data.colors === 'string')
        data.colors = JSON.parse(data.colors);

      if (typeof data.tags === 'string')
        data.tags = JSON.parse(data.tags);

      const product = await Product.create(data);

      res.status(201).json({
        success: true,
        product
      });

    } catch (err) {

      res.status(500).json({
        success: false,
        message: err.message
      });

    }

  }
);

// ================== UPDATE PRODUCT ==================

router.put(
  '/:id',
  protect,
  adminOnly,
  upload.array('images', 5),
  async (req, res) => {

    try {

      const data = { ...req.body };

      if (req.files && req.files.length > 0) {

        data.images = req.files.map(
          file => `/uploads/${file.filename}`
        );

      } else if (req.body.images) {

        data.images =
          typeof req.body.images === 'string'
            ? JSON.parse(req.body.images)
            : req.body.images;

      }

      if (typeof data.sizes === 'string')
        data.sizes = JSON.parse(data.sizes);

      if (typeof data.colors === 'string')
        data.colors = JSON.parse(data.colors);

      if (typeof data.tags === 'string')
        data.tags = JSON.parse(data.tags);

      const product = await Product.findByIdAndUpdate(
        req.params.id,
        data,
        {
          new: true
        }
      );

      res.json({
        success: true,
        product
      });

    } catch (err) {

      res.status(500).json({
        success: false,
        message: err.message
      });

    }

  }
);

// ================== DELETE ==================

router.delete('/:id', protect, adminOnly, async (req, res) => {

  try {

    await Product.findByIdAndUpdate(req.params.id, {
      isActive: false
    });

    res.json({
      success: true
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

});

// ================== REVIEW ==================

router.post('/:id/review', protect, async (req, res) => {

  try {

    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    product.reviews.push({
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment
    });

    product.ratings.count = product.reviews.length;

    product.ratings.average =
      product.reviews.reduce((sum, item) => sum + item.rating, 0) /
      product.reviews.length;

    await product.save();

    res.json({
      success: true,
      product
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

});

module.exports = router;