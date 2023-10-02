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
		const { _id, phoneNumber, isPhoneVerified } = req.user;

		// Prevent sending if number already valid
		if (isPhoneVerified) throw { errMessage: 'Phone number already validated' };

		// Send Code
		const { whatsAppMessage, token } = await sendOTPWhatsAppVerificationCode(_id, phoneNumber);

		console.log('\n.\n.\n.\n');
		console.log({ whatsAppMessage, token });
		console.log('\n.\n.\n.');

		res.json({ message: 'Code successfully sent', token });
	} catch (e) {
		next(e);
	}
};
