const Customer = require('../../models/Customer');
const { addWithdrawalMethod } = require('../../utils/withdrawalMethodsFunctions');

/**
 * ADD WITHDRAWAL METHOD
 *
 * This controller adds a withdrawal method.
 * @param {{type, details: {__WithdrawalMethodDetails}}} req
 * @returns {{__UserData}}
 */
module.exports = async (req, res, next) => {
	try {
		const { _id } = req.user;

		// Add withdrawal method
		const { _id: withdrawalMethodID } = await addWithdrawalMethod(req.body);

		// Update the customer
		const newCustomer = await Customer.findByIdAndUpdate({ _id }, { $addToSet: { withdrawalMethods: withdrawalMethodID } }, { new: true });

		res.json(newCustomer);
	} catch (e) {
		next(e);
	}
};
