const express = require('express');
const chargePayment = require('../controllers/paymentsControllers/chargePayment');
const getPaymentDetails = require('../controllers/paymentsControllers/getPaymentDetails');
const paystackPaymentReceived = require('../controllers/paymentsControllers/paystackPaymentReceived');
const { verifyAuth } = require('../middleware/verifyAuth');
const app = express.Router();

// ===================================================================================================================
//  HOOKS
// ===================================================================================================================
app.get('/payments/paystackPaymentReceived/:type' /*?:action*/, paystackPaymentReceived);

// ===================================================================================================================
//  GET
// ===================================================================================================================
app.get('/payments/details/:key'/*?keyType*/, getPaymentDetails);

// ===================================================================================================================
//  POST
// ===================================================================================================================
app.post('/payments/charge', verifyAuth, chargePayment);

module.exports = app;
