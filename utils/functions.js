const { formattedDate } = require('../helpers/dateTime');

/**
 * HANDLE ERRORS
 */
module.exports.handleErrors = (e, res) => {
	try {
		// Get data
		const {
			message, // Regular Errors (Also used by http-errors and mongoose)
			errors, // Mongoose errors
			status, // Http-errors status
			defMessage, // Default error message
			errType,
			errMessage,
			errStatus,
			errFields // Request or Form errors
		} = e;

		// Setup response
		let response = {
			message: status ? message : defMessage || 'Internal server error. Please try again',
			code: status || 500,
			type: 'Server error'
		};

		// If there was a form error (outside mongoose)
		if (errType && errType.toLowerCase() === 'form error') {
			response.type = errType;
			response.message = errMessage || response.message;
			response.code = errStatus || 400;
			response.errors = errFields;
		}

		// If there was a request or process error
		else if (errMessage) {
			response.type = 'Request Error';
			response.message = errMessage;
			response.code = errStatus || 400;
			response.errors = errFields;
		}

		// If there are Mongoose Validation Errors
		else if (typeof message === 'string' && message.toLowerCase().includes('validation failed')) {
			response.type = 'Form error';
			response.message = 'Form error';
			response.code = 400;
			response.errors = {};
			Object.values(errors).forEach(({ properties: { path, message } }) => {
				response.errors[path] = message;
			});
		}
		// Send error
		console.log({
			message: `${defMessage || 'Error handling Request'} : ${message || errMessage}`
			// response,
			// stack: e.stack
		});
		res.status(response.code).json(response);
	} catch (e) {
		res.status(500).json({ type: 'Server error', message: 'Internal server error. Please try again', code: 500 });
		console.log({ message: e.message, stack: e.stack });
	}
};

/**
 * JOI VALIDATION
 *
 * Custom JOI valifation wrapper function.
 * @param {Joi.Schema} schema - Validation schema for data
 * @param {Object} data - Data being validated
 * @param {{stripUnknown: true, abortEarly: true, throwError: false}} options - JOI Validation options
 * @returns {({__data}|{hasError: true, message: String, fields: Object})} - Data or error object
 */
module.exports.joiValidation = async (schema, data, options = {}) => {
	const { stripUnknown = true, abortEarly = true, throwError = true } = options;
	try {
		const result = await schema.validateAsync(data, { stripUnknown, abortEarly });
		return result;
	} catch (e) {
		const fields = {};
		e.details.forEach(({ path, message }) => (fields[path] = message));

		if (throwError) throw { errMessage: e.details[0].message, errFields: fields };
		return { hasError: true, message: e.details[0].message, fields };
	}
};

/**
 * GENERATE CODE
 * @param {Number} length - Length of the code to generate
 * @param {Boolean} numberOnly - Whether the code should include only numbers
 * @returns {String} - Generated code
 */
module.exports.generateCode = (length, numberOnly) => {
	let result = '';
	const characters = numberOnly ? '0123456789' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	for (let i = 0; i < length; i++) result += characters.charAt(Math.floor(Math.random() * characters.length));
	return result;
};

/**
 * GENERATE A RECEIPT NUMBER
 *
 * This function generates a receipt number in the format (YY MM DD RANDOM).
 * @returns {Number} - Receipt number e.g. 210911473947
 */
module.exports.generateReceiptNumber = () => formattedDate(new Date(), `YYDDMM${this.generateCode(6, true)}`);
