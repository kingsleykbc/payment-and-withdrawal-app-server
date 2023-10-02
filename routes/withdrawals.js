const express = require('express');
const finalizeWithdrawal = require('../controllers/withdrawalControllers/finalizeWithdrawal');
const getWithdrawals = require('../controllers/withdrawalControllers/getWithdrawals');
const initializeWithdrawal = require('../controllers/withdrawalControllers/initializeWithdrawal');
const { verifyAuth } = require('../middleware/verifyAuth');
const app = express.Router();

// ===================================================================================================================
//  GET
// ===================================================================================================================
app.get('/withdrawals', verifyAuth, getWithdrawals);

// ===================================================================================================================
//  POST
// ===================================================================================================================
app.post('/withdrawal/initiate', verifyAuth, initializeWithdrawal);
app.post('/withdrawal/finalize', verifyAuth, finalizeWithdrawal);

module.exports = app;
