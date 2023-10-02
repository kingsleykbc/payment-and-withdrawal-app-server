const WithdrawalMethod = require('../models/withdrawalMethodModel');
const paystack = require('../helpers/paystack');
const { joiValidation } = require('./functions');
const mongoose = require('mongoose');
const { paystackBankRecipientSchema } = require('../validations/joiSchema/withdrawalMethodSchema');
const { WITHDRAWAL_METHOD, WITHDRAWAL_METHOD_CATEGORY, WITHDRAWAL_METHOD_PROVIDER } = require('../config/enums');

/**
 * GET USER'S WITHDRAWAL METHODS FROM IDs
 *
 * @param {[mongoose.Types.ObjectId]} withdrawalMethodsIDs - Customer's withdrawal method IDs
 * @param {"bank"|"card"|"other"} category - Method category
 * @returns {[{__WithdrawalMethod}]} - List of withdrawal methods
 */
module.exports.getWithdrawalMethods = async (withdrawalMethodsIDs, category) => {
	const filter = { _id: withdrawalMethodsIDs, isDeleted: false };
	if (category) filter.category = category;

	// Find and filter the data
	const data = [];
	const withdrawalMethods = await WithdrawalMethod.find(filter);
	for (let i = 0; i < withdrawalMethods.length; i++) {
		const withdrawalMethod = withdrawalMethods[i];

		switch (withdrawalMethod.category) {
			case WITHDRAWAL_METHOD_CATEGORY.BANK:
				data.push(filterBankData(withdrawalMethod));
				break;
		}
	}

	return data;
};

// FILTER BANK DATA
const filterBankData = ({ _id, category, details: { account_name, bank_name, account_number } }) => ({
	_id,
	category,
	details: { last4: account_number.substr(-4), account_name, bank_name }
});

/**
 * ADD WITHDRAWAL METHOD
 *
 * This function simply adds a new withdrawal method.
 * @param {{type, details: {__WithdrawalMethodDetails}}} withdrawalMethodData - Method details
 * @returns {{__WithdrawalMethod}}
 */
module.exports.addWithdrawalMethod = async withdrawalMethodData => {
	const { type, details } = withdrawalMethodData;
	let data;

	switch (type) {
		case WITHDRAWAL_METHOD.PAYSTACK_RECIPIENT_NUBAN:
			data = await this.addPaystackBankRecipient(details);
			break;
		default:
			throw { errMessage: 'Withdrawal method not found' };
	}

	const newWithdrawal = await WithdrawalMethod.create(data);
	return newWithdrawal;
};

/**
 * ADD A PAYSTACK BANK RECIPIENT
 *
 * @param {{type, name, description, account_number, bank_code, currency}} details - As entered in the frontend
 * @returns {{method, category, purpose, details: {recipient_code, type, description, account_number, account_name, bank_name, bank_code }}} - Withdrawal method data
 */
module.exports.addPaystackBankRecipient = async details => {
	const data = await joiValidation(paystackBankRecipientSchema, details);
	details = await paystack.addRecipient(data);
	return {
		provider: WITHDRAWAL_METHOD_PROVIDER.PAYSTACK,
		method: WITHDRAWAL_METHOD.PAYSTACK_RECIPIENT_NUBAN,
		category: WITHDRAWAL_METHOD_CATEGORY.BANK,
		purpose: details.description,
		details
	};
};
