const express = require('express');
const router = express.Router();
const { Guest, Booking } = require('../models');
const logger = require('../utils/logger');

// Get all guests with their stays
router.get('/', async (req, res) => {
  try {
    const guests = await Guest.findAll({
      include: [{
        model: Booking,
        as: 'bookings'
      }]
    });
    res.json({ success: true, data: guests });
  } catch (error) {
    logger.error('Error fetching guests:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get guest by ID
router.get('/:id', async (req, res) => {
  try {
    const guest = await Guest.findByPk(req.params.id, {
      include: [{
        model: Booking,
        as: 'bookings'
      }]
    });
    
    if (!guest) {
      return res.status(404).json({ success: false, error: 'Guest not found' });
    }
    
    res.json({ success: true, data: guest });
  } catch (error) {
    logger.error('Error fetching guest:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new guest
router.post('/', async (req, res) => {
  try {
    const guest = await Guest.create(req.body);
    res.status(201).json({ success: true, data: guest });
  } catch (error) {
    logger.error('Error creating guest:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update guest
router.put('/:id', async (req, res) => {
  try {
    const guest = await Guest.findByPk(req.params.id);
    if (!guest) {
      return res.status(404).json({ success: false, error: 'Guest not found' });
    }
    
    await guest.update(req.body);
    res.json({ success: true, data: guest });
  } catch (error) {
    logger.error('Error updating guest:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete guest
router.delete('/:id', async (req, res) => {
  try {
    const guest = await Guest.findByPk(req.params.id);
    if (!guest) {
      return res.status(404).json({ success: false, error: 'Guest not found' });
    }
    
    await guest.destroy();
    res.json({ success: true, message: 'Guest deleted successfully' });
  } catch (error) {
    logger.error('Error deleting guest:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
