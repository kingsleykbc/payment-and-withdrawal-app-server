const Order = require('../../models/OrderModel');

/**
 * GET USER ID
 *
 * @param {String} customerID - User ID
 * @returns {{amountDue, orders:[{__Order}]}} - Order details
 */
module.exports.getOrderDetails = async customerID => {
	const orders = await Order.find({ customerID }).sort({ hasWithdrawn: 1, dateWithdrawn: -1, createdAt: -1 });

	// Calculate total amount
	let amountDue = 0;

	for (let i = 0; i < orders.length; i++) {
		const { price, hasWithdrawn } = orders[i];
		if (!hasWithdrawn) amountDue += price;
	}

	return { amountDue, orders };
};
