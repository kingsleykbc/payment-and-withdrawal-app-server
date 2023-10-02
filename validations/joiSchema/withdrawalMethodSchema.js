const Joi = require('@hapi/joi');
const { VENDOR_NAMES } = require('../../config');
const { WITHDRAWAL_METHOD_PURPOSE } = require('../../config/enums');
const regex = require('../../config/regex');
const { joiValidation } = require('../../utils/functions');

module.exports.paystackBankRecipientSchema = Joi.object({
	type: Joi.string().default('nuban'),
	name: Joi.string().required(),
	description: Joi.string()
		.valid(...Object.values(WITHDRAWAL_METHOD_PURPOSE))
		.required(),
	account_number: Joi.string().required(),
	bank_code: Joi.string().regex(regex.THREE_DIGITS).required(),
	currency: Joi.string().default('NGN')
});

