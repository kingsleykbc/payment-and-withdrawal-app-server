const { PAYMENT_METHOD_PROVIDER } = require('../../config/enums');
const { deactivateAuthorization } = require('../../helpers/paystack');
const Customer = require('../../models/Customer');
const PaymentMethod = require('../../models/paymentMethodModel');

/**
 * DELETE PAYMENT METHOD
 *
 * This controller adds a withdrawal method.
 *
 * @param {{params: {paymentMethodID}, user}} req
 * @returns {{__UpdatedUser}}
 */
module.exports = async (req, res, next) => {
	try {
		const { _id } = req.user;
		const { paymentMethodID } = req.params;

		// Deactivate auth (if paystack)
		const { provider, details } = await PaymentMethod.findOne({ _id: paymentMethodID });
		if (provider === PAYMENT_METHOD_PROVIDER.PAYSTACK) await deactivateAuthorization(details.authorization_code);

		// Mark as isDeleted
		await PaymentMethod.updateOne({ _id: paymentMethodID }, { isDeleted: true });

		// Update the customer
		const newCustomer = await Customer.findByIdAndUpdate({ _id }, { $pull: { paymentMethods: paymentMethodID } }, { new: true });

		res.json(newCustomer);
	} catch (e) {
		next(e);
	}
};
