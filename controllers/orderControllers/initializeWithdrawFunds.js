const { getOrderDetails } = require('../../utils/orderFunctions/getOrderDetailsFunctions');
const { initiateWithdrawal } = require('../../utils/paymentFunctions/initializeWithdrawalFunctions');

/**
 * WITHDRAW FUNDS (WITH NON-PAYSTACK (OR OTHER 2-STEP WITHDRAWAL METHODS))
 *
 * This controller handle's a customer's funds withdrawal.
 * @param {{ params: {withdrawalMethodID} }} req
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
		const { _id } = req.user;
		const { withdrawalMethodID } = req.params;

		// Get the amount
		const { amountDue: amount } = await getOrderDetails(_id);

		// Initialize
		const initialization = await initiateWithdrawal({ amount, purpose: 'Seller withdrawal', withdrawalMethodID });
		res.json(initialization);
	} catch (e) {
		next(e);
	}
};
