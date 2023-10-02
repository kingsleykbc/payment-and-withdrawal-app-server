const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * @REF Field
 *
 * Seller's withdrawals
 */
const WithdrawalSchema = new Schema(
	{
		totalAmount: { type: Number, required: true }, // Withdrawn amount plus the txn fees
		totalAmountWithoutFees: { type: Number, required: true },
		paymentID: { type: mongoose.Types.ObjectId, required: true },
		withdrawalMethodID: { type: mongoose.Types.ObjectId, required: true },
		customerID: { type: mongoose.Types.ObjectId, required: true }, // SInce no fund ID
		authField: { type: Object }
	},
	{ timestamps: { createdAt: 'date' } }
);

module.exports = mongoose.model('withdrawal', WithdrawalSchema); // withdrawal
