const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', upload.single('image'), (req, res) => {
      console.log("UPLOAD ROUTE HIT");  // 👈 ADD THIS
      console.log("FILE:", req.file);    // 👈 ADD THIS
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const stream = cloudinary.uploader.upload_stream(
      { folder: 'sivakasi-boutique' },
      (error, result) => {
        if (error) {
          return res.status(500).json({ message: error.message });
        }

        return res.json({
          success: true,
          imageUrl: result.secure_url
        });
      }
    );

    stream.end(req.file.buffer);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;