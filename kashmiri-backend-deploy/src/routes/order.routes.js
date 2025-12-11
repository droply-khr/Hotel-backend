const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

// In-memory storage
let restaurantOrders = [];
let coffeeShopOrders = [];

// Restaurant orders
router.get('/restaurant', (req, res) => {
  try {
    res.json({ success: true, data: restaurantOrders });
  } catch (error) {
    logger.error('Error fetching restaurant orders:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/restaurant', (req, res) => {
  try {
    const newOrder = {
      id: `REST-${Date.now()}`,
      ...req.body,
      status: req.body.status || 'pending',
      createdAt: new Date().toISOString()
    };
    restaurantOrders.push(newOrder);
    res.status(201).json({ success: true, data: newOrder });
  } catch (error) {
    logger.error('Error creating restaurant order:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/restaurant/:id', (req, res) => {
  try {
    const index = restaurantOrders.findIndex(order => order.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    restaurantOrders[index] = { ...restaurantOrders[index], ...req.body, updatedAt: new Date().toISOString() };
    res.json({ success: true, data: restaurantOrders[index] });
  } catch (error) {
    logger.error('Error updating restaurant order:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/restaurant/:id', (req, res) => {
  try {
    const index = restaurantOrders.findIndex(order => order.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    restaurantOrders.splice(index, 1);
    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    logger.error('Error deleting restaurant order:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Coffee shop orders
router.get('/coffee-shop', (req, res) => {
  try {
    res.json({ success: true, data: coffeeShopOrders });
  } catch (error) {
    logger.error('Error fetching coffee shop orders:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/coffee-shop', (req, res) => {
  try {
    const newOrder = {
      id: `COFFEE-${Date.now()}`,
      ...req.body,
      status: req.body.status || 'pending',
      createdAt: new Date().toISOString()
    };
    coffeeShopOrders.push(newOrder);
    res.status(201).json({ success: true, data: newOrder });
  } catch (error) {
    logger.error('Error creating coffee shop order:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/coffee-shop/:id', (req, res) => {
  try {
    const index = coffeeShopOrders.findIndex(order => order.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    coffeeShopOrders[index] = { ...coffeeShopOrders[index], ...req.body, updatedAt: new Date().toISOString() };
    res.json({ success: true, data: coffeeShopOrders[index] });
  } catch (error) {
    logger.error('Error updating coffee shop order:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/coffee-shop/:id', (req, res) => {
  try {
    const index = coffeeShopOrders.findIndex(order => order.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    coffeeShopOrders.splice(index, 1);
    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    logger.error('Error deleting coffee shop order:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
