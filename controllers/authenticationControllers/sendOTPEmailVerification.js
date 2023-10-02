const { sendOTPVerificationEmail } = require('../../utils/emailFunctions');

/**
 * SEND / RESEND CONFIRMATION EMAIL
 *
 * This controller sends an email confirmation to the ud new or edited passwords.
 * @returns {{message:'Email verification sent', token}} - Token and message
 */
module.exports = async (req, res, next) => {
	try {
		const { _id, email, isVerified } = req.user;
		if (isVerified) throw { errMessage: 'Email already verified' };

		const { token } = await sendOTPVerificationEmail(_id, email);
		res.json({ message: 'Email verification sent', token });
	} catch (e) {
		next(e);
	}
};
