const { EMAIL_WRAPPER } = require('./components');

/**
 * ACCOUNT RECOVERY EMAIL
 */
module.exports = (subject, body) => EMAIL_WRAPPER(subject, body, null);
