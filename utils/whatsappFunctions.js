const { signToken } = require('../helpers/jwtHelper');
const { encrypt } = require('../helpers/crypt');
const { sendWhatsappMessage } = require('../helpers/whatsappMessanger');
const { generateCode } = require('./functions');

// MESSAGES
const ORDER_PLACED_MESSAGE = require('../config/messages/orderPlacedMessage');
const PHONE_VERIFICATION = require('../config/messages/phoneVerification');

/**
 * SEND "ORDER RECEIVED" MESSAGE
 */
module.exports.sendOrderPlacedMessage = async (phoneNumber, data) => sendWhatsappMessage(phoneNumber, ORDER_PLACED_MESSAGE(data));

/**
 * SEND "VERIFICATION" MESSAGE
 */
module.exports.sendWhatsAppVerificationCode = async (phoneNumber, code) => sendWhatsappMessage(phoneNumber, PHONE_VERIFICATION(code));

/**
 * SEND "OTP VERIFICATION MESSAGE"
 *
 * @param userID - UserID
 * @param phoneNumber - User's phone number
 * @returns {{whatsAppMessage, token}} - Message and token
 */
module.exports.sendOTPWhatsAppVerificationCode = async (userID, phoneNumber) => {
	// Setup code and token
	const otp = generateCode(6, true);
	const token = await signToken('email', userID, { encryptedOTP: await encrypt(otp) });

	const whatsAppMessage = await sendWhatsappMessage(phoneNumber, PHONE_VERIFICATION(otp));
	return { whatsAppMessage, token };
};
