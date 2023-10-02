/**
 * PAYSTACK PAYMENT RECEIVED.
 *
 * This a webhook that is called when the paystack payment is made. It simply verifies
 * that a payment was successful. If not, it handles appropriate actions.
 * (For now, the actions query will not be implemented.).
 *
 * @param {{params:{type:"order payment"}, query:{action: "saveUserPaymentMethod"}}} req
 * @returns {{message:"Received Paystack Payment"}}
 */
module.exports = async (req, res, next) => {
	try {
		// Handle ish here

		res.json({ message: 'Received Paystack Payment' });
	} catch (e) {
		next(e);
	}
};
