const createError = require('http-errors');
const { verifyAccessToken } = require('../helpers/jwtHelper');
const User = require('../models/Customer');

/**
 * VERIFY AUTHRIZATION TOKEN
 *
 * This middleware handles access token validation
 * @param {{headers:{authorization}}} req - Token in header
 * @returns {{__User}} - Validated User
 */
module.exports.verifyAuth = async (req, res, next) => {
	try {
		const { authorization } = req.headers;
		if (!authorization) throw createError.Unauthorized();
		const payload = await verifyAccessToken(authorization.split(' ')[1]);
		req.user = await User.findOne({ _id: payload.aud }).lean();
		next();
	} catch (e) {
		next(e);
	}
};
