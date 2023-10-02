const express = require('express');
const { register, refreshToken, logout, login } = require('../controllers/authentication');
const sendOTPEmailAuthentication = require('../controllers/authenticationControllers/sendOTPEmailAuthentication');
const sendOTPEmailVerification = require('../controllers/authenticationControllers/sendOTPEmailVerification');
const sendOTPWhatsAppAuthentication = require('../controllers/authenticationControllers/sendOTPWhatsAppAuthentication');
const sendOTPWhatsAppVerification = require('../controllers/authenticationControllers/sendOTPWhatsAppVerification');
const validateOTPEmailAuthentication = require('../controllers/authenticationControllers/validateOTPEmailAuthentication');
const validateOTPEmailVerification = require('../controllers/authenticationControllers/validateOTPEmailVerification');
const validateOTPWhatsAppAuthentication = require('../controllers/authenticationControllers/validateOTPWhatsAppAuthentication');
const validateOTPWhatsAppVerification = require('../controllers/authenticationControllers/validateOTPWhatsAppVerification');
const { verifyAuth } = require('../middleware/verifyAuth');
const app = express.Router();

app.post('/register', register);
app.post('/login', login);
app.post('/refreshToken', refreshToken);

app.post('/otp/verification/email', verifyAuth, sendOTPEmailVerification);
app.post('/otp/verification/email/validate', verifyAuth, validateOTPEmailVerification);
app.post('/otp/verification/whatsApp', verifyAuth, sendOTPWhatsAppVerification);
app.post('/otp/verification/whatsApp/validate', verifyAuth, validateOTPWhatsAppVerification);

app.post('/otp/authentication/email', verifyAuth, sendOTPEmailAuthentication);
app.post('/otp/authentication/email/validate', verifyAuth, validateOTPEmailAuthentication);
app.post('/otp/authentication/whatsApp', verifyAuth, sendOTPWhatsAppAuthentication);
app.post('/otp/authentication/whatsApp/validate', verifyAuth, validateOTPWhatsAppAuthentication);

app.delete('/logout', logout);

module.exports = app;
