const { COOKIE_MAX_AGE } = require('../config');
const { generateToken, generateTokens, refreshAccessToken } = require('../helpers/jwtHelper');
const Customer = require('../models/Customer');
const { validateSignUp, validateLogin } = require('../validations/authentication');

/**
 * HANDLE REGISTRATION
 */
module.exports.register = async (req, res, next) => {
	try {
		// Validate
		const { isValid, error, data } = await validateSignUp(req.body);
		if (!isValid) throw error;

		// Create new Customer and tokens
		const newCustomer = await Customer.create(data);
		const { accessToken, refreshToken } = await generateTokens(newCustomer._id);

		res.send({ accessToken, refreshToken });
	} catch (e) {
		e.defMessage = 'Error registering';
		next(e);
	}
};

/**
 * HANDLE LOGIN
 * @param {string} req request Object
 * TODO: Add something here later
 */
module.exports.login = async (req, res, next) => {
	try {
		// Validate
		const {
			isValid,
			error,
			data: { email, password }
		} = await validateLogin(req.body);
		if (!isValid) throw error;

		// Login and generate tokens
		const customer = await Customer.login(email, password);
		const { accessToken, refreshToken } = await generateTokens(customer._id);

		res.send({ customer, accessToken, refreshToken });
	} catch (e) {
		next(e);
	}
};

/**
 * REFRESH TOMEN
 */
module.exports.refreshToken = async (req, res, next) => {
	try {
		const newAccessToken = await refreshAccessToken(req.body.refreshToken);
		res.json({ newAccessToken });
	} catch (e) {
		next(e);
	}
};

/**
 * LOGOUT
 */
module.exports.logout = async (req, res, next) => {
	try {
		res.send('Logout');
	} catch (e) {
		e.defMessage = 'Error logging out';
		next(e);
	}
};
