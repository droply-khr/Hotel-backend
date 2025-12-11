const express = require('express');
const router = express.Router();
const BookingController = require('../controllers/booking.controller');
const multer = require('multer');
const path = require('path');

// Setup multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../../uploads'));
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${unique}-${file.originalname}`);
  }
});

const upload = multer({ storage, limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880') } });

// Create booking with optional payment proof upload
router.post('/', upload.single('payment_proof'), BookingController.createBooking);
router.get('/:id', BookingController.getBookingById);

module.exports = router;
