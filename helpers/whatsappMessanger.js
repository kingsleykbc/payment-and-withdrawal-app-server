const { TWILIO_CONFIG } = require('../config');
const client = require('twilio')(TWILIO_CONFIG.sid, TWILIO_CONFIG.authToken);

// Configure reigion
// client.region = 'au1';
// client.edge = 'sydney';

/**
 * SEND WHATSAPP MESSAGE
 */
module.exports.sendWhatsappMessage = async (number, body) => {
	try {
		const no = number[0] === '+' ? number : number[0] === '0' ? `+234${number.slice(1)}` : `+234${number}`;
		const to = `whatsapp:${no}`;
		const message = await client.messages.create({ from: 'whatsapp:+19842053513', to, body });
		return message;
	} catch (e) {
		throw e;
	}
};
