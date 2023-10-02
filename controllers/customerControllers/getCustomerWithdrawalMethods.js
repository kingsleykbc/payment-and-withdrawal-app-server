const { getWithdrawalMethods } = require('../../utils/withdrawalMethodsFunctions');

/**
 * GET CUSTOMER'S WITHDRAWAL METHODS
 *
 * @param {{query:{category}}} req - Query data
 * @returns {[{_id, category, details: {__WithdrawalMethodDetails}}]}
 */
module.exports = async (req, res, next) => {
	try {
		const { withdrawalMethods } = req.user;
		const { category } = req.query;

		const methods = getWithdrawalMethods(withdrawalMethods, category);
		res.json(methods);
	} catch (e) {
		next(e);
	}
};
