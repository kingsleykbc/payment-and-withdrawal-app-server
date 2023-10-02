const Order = require('../../models/OrderModel');
const { createWithdrawalFromDetailsObject } = require('../../utils/withdrawalFunctions');

/**
 * WITHDRAW FUNDS
 *
 * This controller handles funds withdrawal in the B.E (After the 1 or 2-step payments have been made).
 * @param {{ body:{ withdrawalDetails: {withdrawalMethodID, payment: {__PaymentData}}, [authField]: {field} } }} req - Withdrawal details
 * @returns {{ __WithdrawalData }} - Saved withdrawal
 */
module.exports = async (req, res, next) => {
	try {
		const { _id: customerID } = req.user;
		const { withdrawalDetails, authField } = req.body;

		// Create Withdrawal
		const withdrawal = await createWithdrawalFromDetailsObject(withdrawalDetails, customerID, authField);

		// Update the orders (In LBH or Vybite do func updating here)
		await Order.updateMany({ hasWithdrawn: false }, { dateWithdrawn: new Date(), withdrawalID: withdrawal._id, hasWithdrawn: true });

		res.json(withdrawal);
	} catch (e) {
		next(e);
	}
};
