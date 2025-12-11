const express = require('express');
const router = express.Router();
const emailController = require('../controllers/email.controller');
const multer = require('multer');

// Configure multer for handling multipart/form-data
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Send booking confirmation email
router.post('/send-booking', upload.single('paymentProof'), emailController.sendBookingEmail);

module.exports = router;
