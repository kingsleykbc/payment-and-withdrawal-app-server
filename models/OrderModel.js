const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
	{
		price: { type: Number, required: true },
		hasWithdrawn: { type: Boolean, default: false },
		dateWithdrawn: Date,
		paymentID: mongoose.Types.ObjectId,
		customerID: mongoose.Types.ObjectId,
		withdrawalID: mongoose.Types.ObjectId
	},
	{ timestamps: true }
);

module.exports = mongoose.model('order', OrderSchema);
