const Customer = require('../models/Customer');
const { joiValidation } = require('../utils/functions');
const { registerSchema } = require('./joiSchema/authenticationSchema');

/**
 * VALUDATE SIGN UP
 */
module.exports.validateSignUp = async data => {

  // Make sure data is enetered
  const validation = await joiValidation(registerSchema, data);

  // Validate details
  if (validation.hasError) return {
    isValid: false,
    error: { errType: "form error", errStatus: 422, errMessage: validation.message, errFields: validation.fields }
  }

  // Set data to the sanitized JOI result
  data = validation;

  // Make sure data is not duplicated
  const exists = await Customer.findOne({ email: data.email });
  if (exists) return {
    isValid: false,
    error: { errType: "form error", errStatus: 409, errMessage: "User with this email exists", errFields: { email: "Email already taken" } }
  }

  return { isValid: true, error: {}, data };
}


/**
 * VALUDATE SIGN UP
 */
module.exports.validateLogin = async data => {
  
  // Make sure data is enetered
  const validation = await joiValidation(registerSchema, data);

  // Validate details
  if (validation.hasError) return {
    isValid: false,
    error: { errType: "form error", errStatus: 400, errMessage: "Invalid username or password" },
    data: {}
  }

  return { isValid: true, error: {}, data: validation };
}

