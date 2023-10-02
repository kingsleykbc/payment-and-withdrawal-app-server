const { getPaymentMethods } = require('../../utils/paymentMethodsFunctions');
const { getWithdrawalMethods } = require('../../utils/withdrawalMethodsFunctions');

/**
 *
 */
module.exports = async (req, res, next) => {
	try {
		const customer = req.user;
		customer.paymentMethods = await getPaymentMethods(req.user.paymentMethods);    
		customer.withdrawalMethods = await getWithdrawalMethods(req.user.withdrawalMethods);    
		res.json(customer);
	} catch (e) {
		next(e);
	}
};
