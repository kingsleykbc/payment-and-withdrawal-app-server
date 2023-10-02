const { DOMAIN } = require('../../config');
const { EMAIL_WRAPPER } = require('./components');

/**
 * ACCOUNT RECOVERY EMAIL
 */
module.exports = emailToken =>
	EMAIL_WRAPPER(
		'Account Recovery',
		'You recently reported you forgot your password. To recover your account, click the link below to reset your password.',
		{ label: 'Reset my password', url: `${DOMAIN}/resetpassword/${emailToken}` }
	);
