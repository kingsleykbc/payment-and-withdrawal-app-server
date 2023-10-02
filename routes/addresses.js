const express = require('express');
const deleteAddress = require('../controllers/addressControllers/deleteAddress');
const getAddress = require('../controllers/addressControllers/getAddress');
const updateAddress = require('../controllers/addressControllers/updateAddress');
const { verifyAuth } = require('../middleware/verifyAuth');
const api = express.Router();

// ==============================================================================================
//  GET
// ==============================================================================================
api.get('/addresses/:addressID', getAddress);

// ==============================================================================================
//  PUT
// ==============================================================================================
api.put('/addresses/:addressID', verifyAuth, updateAddress);

// ==============================================================================================
//  DELETE
// ==============================================================================================
api.delete('/addresses/:addressID', verifyAuth, deleteAddress);

module.exports = api;
