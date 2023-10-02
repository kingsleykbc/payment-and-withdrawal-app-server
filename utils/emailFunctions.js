const { signToken } = require('../helpers/jwtHelper');
const { sendEmail } = require('../helpers/mailer');
const { generateCode } = require('./functions');

// EMAILS
const ACCOUNT_RECOVERY_EMAIL = require('../config/emails/accountRecoveryEmails');
const { ACCOUNT_EMAIL_UPDATE, ACCOUNT_EMAIL_CONFIRMATION } = require('../config/emails/emailConfirmation');
const { ACCOUNT_EMAIL_UPDATE_OTP, ACCOUNT_EMAIL_CONFIRMATION_OTP } = require('../config/emails/emailConfirmationOTP');
const { encrypt } = require('../helpers/crypt');

// ===================================================================================================================
//  AUTHENTICATION
// ===================================================================================================================

/**
 * SEND OTP EMAIL CONFIRMATION
 *
 * This function is similar to the one below, but it uses OTP, instead of links.
 * @param {String} userID - The user's ID
 * @param {String} userEmail - The user's email
 * @param {Boolean} isUpdateMessage - If the email is about an email update
 * @returns {{mail, token}} - Sent email and token
 */
module.exports.sendOTPVerificationEmail = async (userID, userEmail, isUpdateMessage) => {
	// Setup code and token
	const otp = generateCode(6, true);
	const token = await signToken('email', userID, { encryptedOTP: await encrypt(otp) });

	// Send mail
	const body = isUpdateMessage ? ACCOUNT_EMAIL_UPDATE_OTP(otp) : ACCOUNT_EMAIL_CONFIRMATION_OTP(otp);
	const message = { subject: 'Email Confirmation', body, sender: 'confirmation@nodesec.com' };
	const mail = await sendEmail(userEmail, message);
	return { mail, token };
};

/**
 * SEND A CONFIRMATION MAIL TO A NEWLY REGISTERED USER / USER THAT UPDATE'S THEIR ACCOUNT
 *
 * @param {String} userID - The user's ID
 * @param {String} userEmail - The user's email
 * @param {Boolean} isUpdateMessage - If the email is about an email update
 * @returns {Object} - Sent email
 */
module.exports.sendConfirmationEmail = async (userID, userEmail, isUpdateMessage) => {
	const token = await signToken('email', userID);

	const body = isUpdateMessage ? ACCOUNT_EMAIL_UPDATE(token) : ACCOUNT_EMAIL_CONFIRMATION(token);
	const message = { subject: 'Email Confirmation', body, sender: 'confirmation@nodesec.com' };
	const mail = await sendEmail(userEmail, message);
	return mail;
};

/**
 * SEND PASSWORD RECOVERY EMAIL
 *
 * @param {String} userEmail - The user's email
 */
module.exports.sendPasswordRecoveryEmail = async (userID, userEmail) => {
	const emailToken = await signToken('email', userID);
	const message = {
		sender: 'recovery@nodesec.com',
		subject: 'Account Recovery',
		body: ACCOUNT_RECOVERY_EMAIL(emailToken)
	};
	return sendEmail(userEmail, message);
};
