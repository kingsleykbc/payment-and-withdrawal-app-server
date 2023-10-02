const jwt = require('jsonwebtoken');
const createError = require('http-errors');

// ==================================================================================================================
//  GENERATE
// ==================================================================================================================
/**
 * GENERATE ACCESS AND REFRESH TOKENS
 */
module.exports.generateTokens = async entityID => ({
	accessToken: await this.signToken('access', entityID),
	refreshToken: await this.signToken('refresh', entityID)
});

/**
 * SIGN NEW TOKEN
 *
 * This function generates a new access or refresh token with the entity ID.
 * @param {("access"|"refresh"|"email"|"admin_access")} type - The type of token being generated
 * @param {String} entityID - The entity ID being tokenized
 * @param {Object} [payload] - The data payload
 * @returns {String} Signed token
 */
module.exports.signToken = (type, entityID, payload = {}) =>
	new Promise((ressolve, reject) => {
		let secret, expiresIn;
		switch (type) {
			case 'email':
				secret = process.env.JWT_EMAIL_SECRET;
				expiresIn = '10m';
				break;
			case 'access':
				secret = process.env.JWT_ACCESS_SECRET;
				expiresIn = '30m';
				break;
			case 'refresh':
				secret = process.env.JWT_REFRESH_SECRET;
				expiresIn = '60d';
				break;
			case 'admin_access':
				secret = process.env.JWT_ADMIN_ACCESS_SECRET;
				expiresIn = '1h';
				break;
		}

		const options = { expiresIn, audience: entityID.toString() };
		jwt.sign(payload, secret, options, (err, token) => {
			if (err) reject(err);
			ressolve(token);
		});
	});

/**
 * REFRESH ACCESS TOKEN
 * This function verifies the refresh token, and generates a new access token if valid.
 * (In future you may want to return a new set of access and refresh tokens)
 */
module.exports.refreshAccessToken = async refreshToken => {
	if (!refreshToken) throw createError.BadRequest();
	const entityID = await this.verifyRefreshToken(refreshToken);

	return this.signToken('access', entityID); // (Maybe in future) return this.generateTokens(entityID);
};

// ==================================================================================================================
//  VERIFY
// ==================================================================================================================
/**
 * VERIFY ACCESS TOKEN
 */
module.exports.verifyAccessToken = token =>
	new Promise((ressolve, reject) => {
		jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, payload) => {
			if (err) {
				const msg = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message;
				reject(createError.Unauthorized(msg));
			}
			ressolve(payload);
		});
	});

/**
 * VERIFY REFRESH TOKEN
 * This function verifies a refresh token and returns the audience (entity ID)
 */
module.exports.verifyRefreshToken = token =>
	new Promise((ressolve, reject) => {
		jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, payload) => {
			if (err) reject(createError.Unauthorized());
			ressolve(payload.aud);
		});
	});

/**
 * VERIFY TOKEN
 *
 * This function verifies a token
 * @param {("access"|"refresh"|"email"|"admin_access")} type - The type of token being generated
 * @param {{jwtErrorMessage, expiredErrorMessage, defaultErrorMessage}} options - Config
 * @param {String} token - Token
 */
module.exports.verifyToken = (type, token, options = {}) =>
	new Promise((ressolve, reject) => {
		const { jwtErrorMessage, expiredErrorMessage, defaultErrorMessage } = options;

		let secret,
			jwtErrMsg = jwtErrorMessage || 'Unauthorized',
			expErrMsg = expiredErrorMessage,
			defErrMsg = defaultErrorMessage;

		switch (type) {
			case 'email':
				secret = process.env.JWT_EMAIL_SECRET;
				jwtErrMsg = jwtErrorMessage || 'Invalid code';
				defErrMsg = defaultErrorMessage || 'Invalid code';
				expErrMsg = expiredErrorMessage || 'Expired code';
				break;
			case 'access':
				secret = process.env.JWT_ACCESS_SECRET;
				break;
			case 'refresh':
				secret = process.env.JWT_REFRESH_SECRET;
				break;
			case 'admin_access':
				secret = process.env.JWT_ADMIN_ACCESS_SECRET;
				break;
		}

		jwt.verify(token, secret, (err, data) => {
			if (err) {
				if (!expErrMsg) expErrMsg = err.message;
				if (!defErrMsg) defErrMsg = err.message;

				const msg = err.name === 'JsonWebTokenError' ? jwtErrMsg : err.message === 'jwt expired' ? expErrMsg : defErrMsg;
				reject(createError.Unauthorized(msg));
			}
			ressolve(data);
		});
	});
