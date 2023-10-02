const Order = require('../../models/OrderModel');
const { finalizeWithdrawal } = require('../../utils/paymentFunctions/finalizeWithdrawalFunctions');
const { createWithdrawalFromDetailsObject } = require('../../utils/withdrawalFunctions');

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
 *  authData: { __BillerInitializationValue },
 *  authField
 * }}} req - Initialization and response
 *
 * @returns {{__Withdrawal}} - Withdrawal details (equivalent of {method, data} for payment)
 */
module.exports = async (req, res, next) => {
	try {
		const { _id } = req.user;
		const { initialization, authData, authField } = req.body;
		const { withdrawalDetails } = await finalizeWithdrawal(initialization, authData);
		const withdrawal = await createWithdrawalFromDetailsObject(withdrawalDetails, _id, authField);

		await Order.updateMany({ hasWithdrawn: false }, { dateWithdrawn: new Date(), withdrawalID: withdrawal._id, hasWithdrawn: true });

		res.json(withdrawal);
	} catch (e) {
		next(e);
	}
};
