const { payUser_finalize } = require("../withdrawalFunctions");

/**
 * WITHDRAW FUNDS (WITH PAYSTACK (OR OTHER 2-STEP WITHDRAWAL METHODS))
 *
 * This controller handle's a customer's funds withdrawal. It returns a withdrawal details
 * object similar to the payment details object.
 *
 * @param {{
 *	message, paymentMethod,	withdrawalMethodID,	payment: { amount, transactionFee, billerTransactionFee },
 * 	data: { __BillerInitializationFields }
 * }} initialization - Initialization data
 * @param {{ __BillerInitializationValue }} authData - Authentication values
 * @returns {{
 * 	message,
 * 	withdrawalDetails: { withdrawalMethodID, payment: {__PaymentData} }
 * }} - Withdrawal details
 */
module.exports.finalizeWithdrawal = async (initialization, authData) => {
	const withdrawal = await payUser_finalize(initialization, authData);
	return withdrawal;
};
