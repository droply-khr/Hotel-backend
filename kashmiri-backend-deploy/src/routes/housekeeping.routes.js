const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

// In-memory storage (will be replaced with database)
let housekeepingTasks = [];
let housekeepingStaff = [];
let roomStatuses = [];

// Get all housekeeping tasks
router.get('/tasks', (req, res) => {
  try {
    res.json({ success: true, data: housekeepingTasks });
  } catch (error) {
    logger.error('Error fetching housekeeping tasks:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create housekeeping task
router.post('/tasks', (req, res) => {
  try {
    const newTask = {
      id: `task-${Date.now()}`,
      ...req.body,
      createdAt: new Date().toISOString()
    };
    housekeepingTasks.push(newTask);
    res.status(201).json({ success: true, data: newTask });
  } catch (error) {
    logger.error('Error creating housekeeping task:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update housekeeping task
router.put('/tasks/:id', (req, res) => {
  try {
    const index = housekeepingTasks.findIndex(task => task.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    
    housekeepingTasks[index] = { ...housekeepingTasks[index], ...req.body, updatedAt: new Date().toISOString() };
    res.json({ success: true, data: housekeepingTasks[index] });
  } catch (error) {
    logger.error('Error updating housekeeping task:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get housekeeping staff
router.get('/staff', (req, res) => {
  try {
    res.json({ success: true, data: housekeepingStaff });
  } catch (error) {
    logger.error('Error fetching housekeeping staff:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create housekeeping staff
router.post('/staff', (req, res) => {
  try {
    const newStaff = {
      id: `staff-${Date.now()}`,
      ...req.body,
      createdAt: new Date().toISOString()
    };
    housekeepingStaff.push(newStaff);
    res.status(201).json({ success: true, data: newStaff });
  } catch (error) {
    logger.error('Error creating housekeeping staff:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update housekeeping staff
router.put('/staff/:id', (req, res) => {
  try {
    const index = housekeepingStaff.findIndex(staff => staff.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Staff not found' });
    }
    
    housekeepingStaff[index] = { ...housekeepingStaff[index], ...req.body, updatedAt: new Date().toISOString() };
    res.json({ success: true, data: housekeepingStaff[index] });
  } catch (error) {
    logger.error('Error updating housekeeping staff:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get room statuses
router.get('/rooms', (req, res) => {
  try {
    res.json({ success: true, data: roomStatuses });
  } catch (error) {
    logger.error('Error fetching room statuses:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update room status
router.put('/rooms/:roomNumber', (req, res) => {
  try {
    const index = roomStatuses.findIndex(room => room.roomNumber === req.params.roomNumber);
    if (index === -1) {
      // Create new room status
      const newRoomStatus = {
        roomNumber: req.params.roomNumber,
        ...req.body,
        updatedAt: new Date().toISOString()
      };
      roomStatuses.push(newRoomStatus);
      return res.json({ success: true, data: newRoomStatus });
    }
    
    roomStatuses[index] = { ...roomStatuses[index], ...req.body, updatedAt: new Date().toISOString() };
    res.json({ success: true, data: roomStatuses[index] });
  } catch (error) {
    logger.error('Error updating room status:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
