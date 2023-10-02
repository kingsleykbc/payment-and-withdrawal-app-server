const mailgun = require('mailgun-js');
const { MAILGUN_CONFIG } = require('../config');
const mg = mailgun(MAILGUN_CONFIG);

// =======================================================================
//  SEND EMAIL
// =======================================================================
/**
 * SEND EMAIL TO VIA MAILGUN
 */
module.exports.sendEmail = async (email, message, sender) => {
	try {
		const { subject, body, sender: mSender } = message;
		const data = {
			from: mSender || sender || 'lagosBusinessHub@lagosBusinessHub.com',
			to: email,
			html: body,
			subject
		};
		const sentMail = await mg.messages().send(data);
		return sentMail;
	} catch (e) {
		throw (`Error sending Mail`, e);
	}
};

// =======================================================================
//  MAILING LISTS
// =======================================================================
/**
 * ADD MEMBER TO MAILING LIST
 */
module.exports.addMemberToMailingList = async (email, list, name) => {
	try {
		const mailgunList = mg.lists(`${list}@${MAILGUN_CONFIG.domain}`);
		await removeMemberFromList(email, mailgunList);

		const newMember = await mailgunList.members().create({ subscribed: true, address: email, name: name || email });
		return newMember;
	} catch (e) {
		throw ('Error adding member to mailing list', e);
	}
};

/**
 * CHECK IF MEMBER IS IN MAILING LIST
 */
const removeMemberFromList = async (email, mailgunList) => {
	try {
		const removedMember = await mailgunList.members(email).delete();
		return removedMember;
	} catch (e) {
		return 'User not found';
	}
};
