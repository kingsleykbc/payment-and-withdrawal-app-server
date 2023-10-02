const Customer = require('../../models/Customer');
const { addPaymentMethod } = require('../../utils/paymentMethodsFunctions');

/**
 * ADD PAYMENT METHOD
 *
 * This controller adds a withdrawal method.
 * @param {{type, details: {__PaymentMethodDetails}}} req - Payment method and details
 * @returns {{__UserData}}
 */
module.exports = async (req, res, next) => {
	try {
		const { _id } = req.user;
		const { _id: paymentMethodID, alreadyAdded } = await addPaymentMethod(req.body);

		if (alreadyAdded) res.json({ message: 'Payment method already added' });
		else {
			const newCustomer = await Customer.findByIdAndUpdate({ _id }, { $addToSet: { paymentMethods: paymentMethodID } }, { new: true });
			res.json(newCustomer);
		}
	} catch (e) {
		next(e);
	}
};
