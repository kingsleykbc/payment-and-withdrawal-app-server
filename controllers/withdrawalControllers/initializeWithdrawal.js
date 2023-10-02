const { initiateWithdrawal } = require('../../utils/paymentFunctions/initializeWithdrawalFunctions');

/**
 * WITHDRAW FUNDS (WITH NON-PAYSTACK (OR OTHER 2-STEP WITHDRAWAL METHODS))
 *
 * This controller handle's a customer's funds withdrawal.
 * @param {{ body: {amount, purpose, [withdrawalMethodID], [withdrawalMethod]:{type, __WithdrawalMethodDetails}} }} req
 * @returns {{
 * 	message,
 * 	paymentMethod,
 * 	withdrawalMethodID,
 * 	payment: {amount, transactionFee, billerTransactionFee},
 * 	data: {__BillerInitializationFields}
 * }} - Initialization
 */
module.exports = async (req, res, next) => {
	try {
		const data = await initiateWithdrawal(req.body);
		res.json(data);
	} catch (e) {
		next(e);
	}
};
