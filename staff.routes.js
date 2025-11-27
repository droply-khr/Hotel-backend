const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const staffController = require('../controllers/staff.controller');

// Ensure uploads/staff directory exists
const uploadDir = path.join(__dirname, '..', '..', 'uploads', 'staff');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const unique = `${Date.now()}-${Math.round(Math.random()*1e9)}`;
    const ext = path.extname(file.originalname) || '';
    cb(null, `${file.fieldname}-${unique}${ext}`);
  }
});

const upload = multer({ storage });

// Create staff (accepts multipart with cnic_front and cnic_back files)
router.post('/', upload.fields([{ name: 'cnic_front', maxCount: 1 }, { name: 'cnic_back', maxCount: 1 }]), staffController.createStaff);

// List staff
router.get('/', staffController.listStaff);

module.exports = router;
