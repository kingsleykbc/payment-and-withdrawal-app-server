const mongoose = require('mongoose');
const { PAYMENT_METHOD_USER, PAYMENT_METHOD_CATEGORY, PAYMENT_METHOD_PROVIDER } = require('../config/enums');
const Schema = mongoose.Schema;

//
// PAYMENT METHOD MODEL
//
const PaymentMethodSchema = new Schema(
	{
		method: { type: String, required: true, enum: [...Object.values(PAYMENT_METHOD_USER)] },
		category: { type: String, required: true, enum: [...Object.values(PAYMENT_METHOD_CATEGORY)] },
		provider: { type: String, required: true, enum: [...Object.values(PAYMENT_METHOD_PROVIDER)] },
		countryCode: { type: String, default: 'NGN' },
		details: { type: Object, required: true },
		isDeleted: { type: Boolean, default: false }
	},
	{
		timestamps: { createdAt: 'datePosted', updatedAt: 'updatedAt' }
	}
);

module.exports = mongoose.model('paymentmethod', PaymentMethodSchema);

/**
 * DETAILS SCHEMA ([method]: [details])
 *
 * NOTE: The second half of the [details] attributes are will be constant across all methods of same category.
 * @type {[
 * 		{"paystack-authorization_card": {authorization_code, email,   last4, card_type, exp_month, exp_year }},
 * 		{"paystack-authorization_bank": {authorization_code, email,   last4, account_name, bank_name }},
 * 		{"paystack-authorization_other": {authorization_code, email,   channel }}
 * ]}
 */
