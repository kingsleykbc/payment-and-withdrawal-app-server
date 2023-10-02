const { compare } = require('../../helpers/crypt');
const { verifyToken } = require('../../helpers/jwtHelper');
const Customer = require('../../models/Customer');

/**
 * VALIDATE CONFIRMATION EMAIL
 *
 * This controller sends an email confirmation to the ud new or edited passwords.
 * @param {{ body:{otp, token} }} req - User ID to send email to
 * @returns {{ message:'Email verification sent', token }} - Token and message
 */
module.exports = async (req, res, next) => {
	try {
		const { _id } = req.user;
		const { token, otp } = req.body;

		// Validate
		const { aud, encryptedOTP } = await verifyToken('email', token, { jwtErrorMessage: 'Code not correct' });
		const codeValid = await compare(otp, encryptedOTP);
		if (aud !== _id.toString() || !codeValid) throw { errMessage: 'Invalid code', errStatus: 401 };

		res.json({ message: 'Phone number successfully Verified!', isValid: true });
	} catch (e) {
		next(e);
	}
};
