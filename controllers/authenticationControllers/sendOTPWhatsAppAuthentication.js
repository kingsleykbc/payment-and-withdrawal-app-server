const { sendOTPWhatsAppVerificationCode } = require('../../utils/whatsappFunctions');

/**
 * SEND VERIFICATION CODE TO SELLER'S WHATSAPP
 *
 * This controller sends a verifcation code to the user (particularly seller).
 * @param {{userID}} req - User ID
 * @returns {{message: "Code successfully sent", token: String }} Success message and token
 */
module.exports = async (req, res, next) => {
	try {
		const { _id, phoneNumber } = req.user;

		// Send Code
		const { token } = await sendOTPWhatsAppVerificationCode(_id, phoneNumber);

		res.json({ message: 'Code successfully sent', token });
	} catch (e) {
		next(e);
	}
};
