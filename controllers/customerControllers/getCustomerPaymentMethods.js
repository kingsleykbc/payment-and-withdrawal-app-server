const { getPaymentMethods } = require('../../utils/paymentMethodsFunctions');

/**
 * GET CUSTOMER'S PAYMENT METHODS
 *
 * @param {{query:{category}}} req - Query data
 * @returns {[{_id, category, details: {__PaymentMethodDetails}}]}
 */
module.exports = async (req, res, next) => {
	try {
		const { paymentMethods } = req.user;
		const { category } = req.query;

		const methods = await getPaymentMethods(paymentMethods, category);
		res.json(methods);
	} catch (e) {
		next(e);
	}
};
