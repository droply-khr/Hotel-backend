const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

// In-memory storage for payments (will be replaced with database)
let payments = [];
let paymentAccounts = [];

// Get all payment accounts
router.get('/accounts', (req, res) => {
  try {
    res.json({ success: true, data: paymentAccounts });
  } catch (error) {
    logger.error('Error fetching payment accounts:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create payment account
router.post('/accounts', (req, res) => {
  try {
    const newAccount = {
      id: `acc-${Date.now()}`,
      ...req.body,
      balance: req.body.openingBalance || 0,
      totalCredit: 0,
      totalDebit: 0,
      transactions: [],
      createdAt: new Date().toISOString()
    };
    paymentAccounts.push(newAccount);
    res.status(201).json({ success: true, data: newAccount });
  } catch (error) {
    logger.error('Error creating payment account:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update payment account
router.put('/accounts/:id', (req, res) => {
  try {
    const index = paymentAccounts.findIndex(acc => acc.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Account not found' });
    }
    
    paymentAccounts[index] = { ...paymentAccounts[index], ...req.body };
    res.json({ success: true, data: paymentAccounts[index] });
  } catch (error) {
    logger.error('Error updating payment account:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete payment account
router.delete('/accounts/:id', (req, res) => {
  try {
    const index = paymentAccounts.findIndex(acc => acc.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Account not found' });
    }
    
    paymentAccounts.splice(index, 1);
    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    logger.error('Error deleting payment account:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all payments
router.get('/', (req, res) => {
  try {
    res.json({ success: true, data: payments });
  } catch (error) {
    logger.error('Error fetching payments:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create payment
router.post('/', (req, res) => {
  try {
    const newPayment = {
      id: `pay-${Date.now()}`,
      ...req.body,
      createdAt: new Date().toISOString()
    };
    payments.push(newPayment);
    
    // Update account balance if accountId provided
    if (req.body.accountId) {
      const account = paymentAccounts.find(acc => acc.id === req.body.accountId);
      if (account) {
        if (req.body.type === 'credit') {
          account.balance += req.body.amount;
          account.totalCredit += req.body.amount;
        } else if (req.body.type === 'debit') {
          account.balance -= req.body.amount;
          account.totalDebit += req.body.amount;
        }
        account.transactions = account.transactions || [];
        account.transactions.push(newPayment);
      }
    }
    
    res.status(201).json({ success: true, data: newPayment });
  } catch (error) {
    logger.error('Error creating payment:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
