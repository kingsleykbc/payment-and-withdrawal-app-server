const { chargeUser } = require('../../utils/paymentFunctions');

/**
 * CHARGE A USER
 *
 * This controller handles charging a user via payment ID and returns a payment details object.
 *
 * @param {{body:{amount, paymentMethodID}}} req - Payment method ID
 * @returns {{
 * 	method: "Paystack charge"|"Paystack transfer",
 * 	data: Object,
 * 	amount: {amount, billerFee, amountForBillerCharge, amountAfterFees, totalFee, appFee }
 * }}
 */
module.exports = async (req, res, next) => {
	try {
		const { amount, paymentMethodID } = req.body;
		const paymentDetails = await chargeUser(amount, paymentMethodID);
		res.json(paymentDetails);
	} catch (e) {
		next(e);
	}
};
