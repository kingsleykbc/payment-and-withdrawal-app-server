const { getOrderDetails } = require('../../utils/orderFunctions/getOrderDetailsFunctions');

/**
 * GET ORDERS DETAILS
 *
 * Get the total amount due and the orders (arranged from un-withdrawn to withdrawn).
 * @returns {{amountDue, orders:[{__Order}]}} - Order details
 */
module.exports = async (req, res, next) => {
	try {
		const { _id } = req.user;
		const orderDetails = await getOrderDetails(_id);
		res.json(orderDetails);
	} catch (e) {
		next(e);
	}
};
