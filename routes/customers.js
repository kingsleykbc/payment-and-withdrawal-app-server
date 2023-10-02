const express = require('express');
const addCustomerPaymentMethod = require('../controllers/customerControllers/addCustomerPaymentMethod');
const addCustomerWithdrawalMethod = require('../controllers/customerControllers/addCustomerWithdrawalMethod');
const deleteCustomerPaymentMethod = require('../controllers/customerControllers/deleteCustomerPaymentMethod');
const deleteCustomerWithdrawalMethod = require('../controllers/customerControllers/deleteCustomerWithdrawalMethod');
const getCustomerDetails = require('../controllers/customerControllers/getCustomerDetails');
const getCustomerPaymentMethods = require('../controllers/customerControllers/getCustomerPaymentMethods');
const getCustomerWithdrawalMethods = require('../controllers/customerControllers/getCustomerWithdrawalMethods');
const updateUserData = require('../controllers/customerControllers/updateUserData');
const { verifyAuth } = require('../middleware/verifyAuth');
const app = express.Router();

app.get('/customer', verifyAuth, getCustomerDetails);
app.get('/customers/withdrawalMethods' /*?:category*/, verifyAuth, getCustomerWithdrawalMethods);
app.get('/customers/paymentMethods', verifyAuth, getCustomerPaymentMethods);

app.post('/customers/withdrawalMethods', verifyAuth, addCustomerWithdrawalMethod);
app.post('/customers/paymentMethods', verifyAuth, addCustomerPaymentMethod);

app.put('/customer', verifyAuth, updateUserData);

app.delete('/customers/paymentMethods/:paymentMethodID', verifyAuth, deleteCustomerPaymentMethod);
app.delete('/customers/withdrawalMethods/:withdrawalMethodID', verifyAuth, deleteCustomerWithdrawalMethod);

module.exports = app;
