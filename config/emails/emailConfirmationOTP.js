const { EMAIL_WRAPPER } = require('./components');

/**
 * EMAIL FOR USERS TO VERIFY THEIR ACCOUNTS
 */
module.exports.ACCOUNT_EMAIL_CONFIRMATION_OTP = otp =>
	EMAIL_WRAPPER(
		'Email Confirmation',
		`
			All done! thank you for signing up. Please enter the OTP below to verify your account

			<div style='font-size: 2rem; margin: 20px 0; color: #000'>${otp}</div>
		`
	);

/**
 * VERIFY EMAIL (AFTER UPDATING)
 */
module.exports.ACCOUNT_EMAIL_UPDATE_OTP = otp =>
	EMAIL_WRAPPER(
		'Updated Email Confirmation',
		`
			Hello! We noticed that you changed <b>Lagos Business Hub</b> account's email to this email.  
			Please click the button below to verify this.
		`
	);
