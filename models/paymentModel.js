const mongoose = require('mongoose');
const { PAYMENT_TYPE, PAYMENT_METHOD, PAYMENT_PURPOSE, PAYMENT_METHOD_PROVIDER } = require('../config/enums');
const Schema = mongoose.Schema;

const PaymentSchema = new Schema(
	{
		type: { type: String, required: true, enum: [...Object.values(PAYMENT_TYPE)] },
		method: { type: String, required: true, enum: [...Object.values(PAYMENT_METHOD)] },
		purpose: { type: String, required: true, enum: [...Object.values(PAYMENT_PURPOSE)] },
		provider: { type: String, required: true, enum: [...Object.values(PAYMENT_METHOD_PROVIDER)] },

		amount: { type: Number, required: true },
		transactionFee: { type: Number, required: true }, // Total transaction fee (profit is transactionFee - billerTransactionFee)
		billerTransactionFee: { type: Number, required: true }, // Biller transaction fee
		currency: { type: String, default: 'NGN' },

		reference: { type: String, required: true }, // For 3rd party billing services (or receipt no for physical)
		receiptNo: { type: String, required: true, unique: true }, // Generated payment REF (YYMMDD-RANDOM)
		comment: String,
		details: Object, // Extra optional details depending on the method used (e.g. for paystack use { charge: XXX... })

		billingAddressID: mongoose.Types.ObjectId // (optional for now)
	},
	{
		timestamps: { createdAt: 'date', updatedAt: 'updatedAt' }
	}
);

module.exports = mongoose.model('payment', PaymentSchema); //Payment
