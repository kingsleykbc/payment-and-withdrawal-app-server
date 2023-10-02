const { payUser_initiate } = require('../withdrawalFunctions');
const { addWithdrawalMethod } = require('../withdrawalMethodsFunctions');

/**
 * INITIALIZE WITHDRAW FUNDS (WITH PAYSTACK (OR OTHER 2-STEP WITHDRAWAL METHODS))
 *
 * This controller handle's a customer's funds withdrawal.
 * @param {{ amount, purpose, withdrawalMethodID, withdrawalMethod:{type, __WithdrawalMethodDetails} }} method - Withdrawal method
 * @returns {{
 * 	message,
 * 	paymentMethod,
 * 	withdrawalMethodID,
 * 	payment: {amount, transactionFee, billerTransactionFee},
 * 	data: {__BillerInitializationFields}
 * }} - Initialization
 */
module.exports.initiateWithdrawal = async method => {
	let { withdrawalMethodID, withdrawalMethod, amount, purpose } = method;
	if (!withdrawalMethodID) {
		const newWithdrawalMethod = await addWithdrawalMethod(withdrawalMethod);
		withdrawalMethodID = newWithdrawalMethod._id;
	}

	// Initialize the payment
	const initialization = await payUser_initiate(amount, withdrawalMethodID, purpose);
	return initialization;
};
