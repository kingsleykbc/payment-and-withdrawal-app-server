const { finalizeWithdrawal } = require('../../utils/paymentFunctions/finalizeWithdrawalFunctions');

/**
 * WITHDRAW FUNDS (WITH NON-PAYSTACK (OR OTHER 2-STEP WITHDRAWAL METHODS))
 *
 * This controller handle's a customer's funds withdrawal. It returns a response message and a payment object
 * this payment object can then be validated and used to create a withdrawal object somewhere else in the
 * application.
 *
 * @param {{ body: {
 * 	initialization: {
 * 		message,
 * 		paymentMethod,
 * 		withdrawalMethodID,
 * 		payment: { amount, transactionFee, billerTransactionFee },
 * 		data: { __BillerInitializationFields }
 * 	},
 *  authData: { __BillerInitializationValue }
 * }}} req - Initialization and response
 *
 * @returns {{ 
 * 	message, 
 * 	withdrawalDetails: {withdrawalMethodID, payment: {__PaymentData}} 
 * }} - Withdrawal details (equivalent of {method, data} for payment)
 */
module.exports = async (req, res, next) => {
	try {
		const { initialization, authData } = req.body;
		const data = await finalizeWithdrawal(initialization, authData);
		res.json(data);
	} catch (e) {
		next(e);
	}
};
