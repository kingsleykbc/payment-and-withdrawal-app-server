const Order = require('../../models/OrderModel');
const { createPaymentFromDetailsObject } = require('../../utils/paymentFunctions');

/**
 * CREATE ORDER
 *
 * This simply creates an order from a payment.
 * @param {{ body: { payment:{ type, data, amount }, __otherOrderFields } }} req - Request.
 * @returns {{ __Order }}
 */
module.exports = async (req, res, next) => {
	try {
		const { _id: customerID } = req.user;
		const { payment } = req.body;
		const newPayment = await createPaymentFromDetailsObject(payment, 'Order payment', 'Incoming');
		const order = await Order.create({
			price: payment.amount.amountAfterFees,
			paymentID: newPayment._id,
			customerID
		});
		res.json(order);
	} catch (e) {
		next(e);
	}
};
