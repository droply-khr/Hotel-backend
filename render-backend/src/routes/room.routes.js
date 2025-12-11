const express = require('express');
const router = express.Router();
const { RoomType } = require('../models');
const logger = require('../utils/logger');

// In-memory storage for room instances
let rooms = [];

// Get all room types
router.get('/types', async (req, res) => {
  try {
    const roomTypes = await RoomType.findAll();
    res.json({ success: true, data: roomTypes });
  } catch (error) {
    logger.error('Error fetching room types:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all rooms
router.get('/', (req, res) => {
  try {
    res.json({ success: true, data: rooms });
  } catch (error) {
    logger.error('Error fetching rooms:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create room
router.post('/', (req, res) => {
  try {
    const newRoom = {
      id: `room-${Date.now()}`,
      ...req.body,
      status: req.body.status || 'available',
      cleaningStatus: req.body.cleaningStatus || 'clean',
      createdAt: new Date().toISOString()
    };
    rooms.push(newRoom);
    res.status(201).json({ success: true, data: newRoom });
  } catch (error) {
    logger.error('Error creating room:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update room
router.put('/:id', (req, res) => {
  try {
    const index = rooms.findIndex(room => room.id === req.params.id || room.roomNumber === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Room not found' });
    }
    
    rooms[index] = { ...rooms[index], ...req.body, updatedAt: new Date().toISOString() };
    res.json({ success: true, data: rooms[index] });
  } catch (error) {
    logger.error('Error updating room:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get room availability
router.get('/availability', (req, res) => {
  try {
    const { checkIn, checkOut } = req.query;
    // For now, return all rooms - implement proper availability logic later
    res.json({ success: true, data: rooms });
  } catch (error) {
    logger.error('Error checking room availability:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
