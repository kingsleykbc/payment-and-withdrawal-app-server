const Joi = require('@hapi/joi');
const { VENDOR_NAMES } = require('../../config');
const { joiValidation } = require('../../utils/functions');

module.exports.registerSchema = Joi.object({
	name: Joi.string(),
	email: Joi.string().email().lowercase().required().messages({
		'string.email': 'Email must be valid',
		'string.empty': 'Email cannot be empty',
		'any.required': 'Email is required'
	}),

	password: Joi.string().min(6).required().messages({
		'string.min': 'Password should have a minimum length of {#limit}',
		'any.required': 'Password is required'
	})
});
