const Withdrawal = require('../../models/withdrawalModel');

/**
 * GET CUSTOMER'S WITHDRAWALS
 *
 * @returns {[{__Withdrawal}]} - List of withdrawals
 */
module.exports = async (req, res, next) => {
	try {
		const { _id: customerID } = req.user;
		const withdrawals = await Withdrawal.find({ customerID }).sort({ date: -1 });
		res.json(withdrawals);
	} catch (e) {
		next(e);
	}
};
