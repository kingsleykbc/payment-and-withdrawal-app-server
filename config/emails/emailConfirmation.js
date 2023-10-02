const { DOMAIN } = require('../../config');
const { EMAIL_WRAPPER } = require('./components');

/**
 * EMAIL FOR USERS TO VERIFY THEIR ACCOUNTS
 */
module.exports.ACCOUNT_EMAIL_CONFIRMATION = emailToken =>
	EMAIL_WRAPPER('Email Confirmation', 'All done! Please confirm that you want to use this email for your LBH account', {
		label: 'Verify my email',
		url: `${DOMAIN}/confirmation/${emailToken}`
	});

/**
 * VERIFY EMAIL (AFTER UPDATING)
 */
module.exports.ACCOUNT_EMAIL_UPDATE = emailToken =>
	EMAIL_WRAPPER(
		'Updated Email Confirmation',
		"Hello! We noticed that you changed <b>Lagos Business Hub</b> account's email to this email.  Please click the button below to verify this ",
		{ label: 'Verify my email', url: `${DOMAIN}/confirmation/${emailToken}` }
	);
