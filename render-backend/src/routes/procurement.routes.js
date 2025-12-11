const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

// In-memory storage
let purchaseOrders = [];
let maintenanceRecords = [];
let vendors = [];
let storeRequisitions = [];

// Purchase Orders
router.get('/purchase-orders', (req, res) => {
  try {
    res.json({ success: true, data: purchaseOrders });
  } catch (error) {
    logger.error('Error fetching purchase orders:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/purchase-orders', (req, res) => {
  try {
    const newPO = {
      id: `PO-${Date.now()}`,
      ...req.body,
      status: req.body.status || 'pending',
      createdAt: new Date().toISOString()
    };
    purchaseOrders.push(newPO);
    res.status(201).json({ success: true, data: newPO });
  } catch (error) {
    logger.error('Error creating purchase order:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/purchase-orders/:id', (req, res) => {
  try {
    const index = purchaseOrders.findIndex(po => po.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Purchase order not found' });
    }
    
    purchaseOrders[index] = { ...purchaseOrders[index], ...req.body, updatedAt: new Date().toISOString() };
    res.json({ success: true, data: purchaseOrders[index] });
  } catch (error) {
    logger.error('Error updating purchase order:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Maintenance Records
router.get('/maintenance', (req, res) => {
  try {
    res.json({ success: true, data: maintenanceRecords });
  } catch (error) {
    logger.error('Error fetching maintenance records:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/maintenance', (req, res) => {
  try {
    const newRecord = {
      id: `MAINT-${Date.now()}`,
      ...req.body,
      status: req.body.status || 'pending',
      createdAt: new Date().toISOString()
    };
    maintenanceRecords.push(newRecord);
    res.status(201).json({ success: true, data: newRecord });
  } catch (error) {
    logger.error('Error creating maintenance record:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/maintenance/:id', (req, res) => {
  try {
    const index = maintenanceRecords.findIndex(rec => rec.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Maintenance record not found' });
    }
    
    maintenanceRecords[index] = { ...maintenanceRecords[index], ...req.body, updatedAt: new Date().toISOString() };
    res.json({ success: true, data: maintenanceRecords[index] });
  } catch (error) {
    logger.error('Error updating maintenance record:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Vendors
router.get('/vendors', (req, res) => {
  try {
    res.json({ success: true, data: vendors });
  } catch (error) {
    logger.error('Error fetching vendors:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/vendors', (req, res) => {
  try {
    const newVendor = {
      id: `VEN-${Date.now()}`,
      ...req.body,
      createdAt: new Date().toISOString()
    };
    vendors.push(newVendor);
    res.status(201).json({ success: true, data: newVendor });
  } catch (error) {
    logger.error('Error creating vendor:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/vendors/:id', (req, res) => {
  try {
    const index = vendors.findIndex(ven => ven.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Vendor not found' });
    }
    
    vendors[index] = { ...vendors[index], ...req.body, updatedAt: new Date().toISOString() };
    res.json({ success: true, data: vendors[index] });
  } catch (error) {
    logger.error('Error updating vendor:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Store Requisitions
router.get('/requisitions', (req, res) => {
  try {
    res.json({ success: true, data: storeRequisitions });
  } catch (error) {
    logger.error('Error fetching store requisitions:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/requisitions', (req, res) => {
  try {
    const newReq = {
      id: `REQ-${req.body.department ? req.body.department.substring(0, 2).toUpperCase() : 'GEN'}-${Date.now()}`,
      ...req.body,
      status: req.body.status || 'pending',
      createdAt: new Date().toISOString()
    };
    storeRequisitions.push(newReq);
    res.status(201).json({ success: true, data: newReq });
  } catch (error) {
    logger.error('Error creating store requisition:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/requisitions/:id', (req, res) => {
  try {
    const index = storeRequisitions.findIndex(req => req.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Requisition not found' });
    }
    
    storeRequisitions[index] = { ...storeRequisitions[index], ...req.body, updatedAt: new Date().toISOString() };
    res.json({ success: true, data: storeRequisitions[index] });
  } catch (error) {
    logger.error('Error updating requisition:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
