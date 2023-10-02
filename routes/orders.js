const express = require('express');
const createOrder = require('../controllers/orderControllers/createOrder');
const finalizeWithdrawFunds = require('../controllers/orderControllers/finalizeWithdrawFunds');
const getOrdersDetails = require('../controllers/orderControllers/getOrdersDetails');
const initializeWithdrawFunds = require('../controllers/orderControllers/initializeWithdrawFunds');
const withdrawFunds = require('../controllers/orderControllers/withdrawFunds');
const { verifyAuth } = require('../middleware/verifyAuth');
const app = express.Router();

app.get('/orders/details', verifyAuth, getOrdersDetails);

app.post('/orders', verifyAuth, createOrder);
app.post('/orders/withdrawFunds/initialize/:withdrawalMethodID', verifyAuth, initializeWithdrawFunds);
app.post('/orders/withdrawFunds/finalize', verifyAuth, finalizeWithdrawFunds);
app.post('/orders/withdrawFunds', verifyAuth, withdrawFunds);

module.exports = app;
