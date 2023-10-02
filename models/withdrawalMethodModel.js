const mongoose = require('mongoose');
const { WITHDRAWAL_METHOD, WITHDRAWAL_METHOD_CATEGORY, WITHDRAWAL_METHOD_PURPOSE, WITHDRAWAL_METHOD_PROVIDER } = require('../config/enums');
const Schema = mongoose.Schema;

//
// WITHDRAWAL METHOD MODEL
//
const WithdrawalMethodSchema = new Schema(
	{
		provider: { type: String, required: true, enum: [...Object.values(WITHDRAWAL_METHOD_PROVIDER)] },
		method: { type: String, required: true, enum: [...Object.values(WITHDRAWAL_METHOD)] },
		category: { type: String, required: true, enum: [...Object.values(WITHDRAWAL_METHOD_CATEGORY)] },
		purpose: { type: String, required: true, enum: [...Object.values(WITHDRAWAL_METHOD_PURPOSE)] },
		details: { type: Object, required: true },
		isDeleted: { type: Boolean, default: false }
	},
	{
		timestamps: {
			createdAt: 'datePosted',
			updatedAt: 'updatedAt'
		}
	}
);

module.exports = mongoose.model('withdrawalmethod', WithdrawalMethodSchema);

/**
 * DETAILS SCHEMA ([method]: [details])
 *
 * @type {[
 * 		{"paystack-recipient_nuban": {recipient_code, type, description, account_number, account_name, bank_name, bank_code}}
 * ]}
 */
