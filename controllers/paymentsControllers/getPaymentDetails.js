const Payment = require('../../models/paymentModel');
const Address = require('../../models/addressModel');

/**
 * GET PAYMENT DETAILS
 *
 * This controller gets the display details of a payment from it's ID or receipt
 * number.
 * @param {{ query: {keyType:("paymentID"|"receiptNo")}, params: {key} }} req - Request details
 * @returns {{_id, type, purpose, date, currency, amount, transactionFees, method, reference, [billingAddress]}}
 */
module.exports = async (req, res, next) => {
	try {
		// Get the data
		const { keyType = 'receiptNo' } = req.query;
		const { key } = req.params;
		const filter = keyType === 'receiptNo' ? { receiptNo: key } : { _id: key };

		// Get payment details
		const payment = await Payment.findOne(filter);
		if (payment.billingAddressID) payment.billingAddress = await Address.findOne({ _id: payment.billingAddressID });

		res.json(payment);
	} catch (e) {
		next(e);
	}
};
