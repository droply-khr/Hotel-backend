const { Staff } = require('../models');
const logger = require('../utils/logger');

exports.createStaff = async (req, res, next) => {
  try {
    const payload = req.body || {};

    const staffData = {
      name: payload.name,
      designation: payload.designation || null,
      department: payload.department || null,
      salary: payload.salary || null,
      joining_date: payload.joiningDate || null,
      status: payload.status || 'Active',
      phone: payload.phone || null,
      email: payload.email || null,
      address: payload.address || null,
      emergency_contact: payload.emergencyContact || null,
      allowed_leaves: payload.allowedLeaves || 12,
      paid_leaves_taken: payload.paidLeavesTaken || 0,
      unpaid_leaves_taken: payload.unpaidLeavesTaken || 0,
      advances: payload.advances || 0
    };

    // files (if uploaded via multipart/form-data)
    if (req.files) {
      if (req.files['cnic_front'] && req.files['cnic_front'][0]) {
        staffData.cnic_front_path = req.files['cnic_front'][0].path;
      }
      if (req.files['cnic_back'] && req.files['cnic_back'][0]) {
        staffData.cnic_back_path = req.files['cnic_back'][0].path;
      }
    }

    const created = await Staff.create(staffData);
    res.status(201).json({ success: true, staff: created });
  } catch (err) {
    logger.error('createStaff error', err);
    next(err);
  }
};

exports.listStaff = async (req, res, next) => {
  try {
    const staff = await Staff.findAll({ order: [['id', 'DESC']] });
    res.json({ success: true, staff });
  } catch (err) {
    next(err);
  }
};
