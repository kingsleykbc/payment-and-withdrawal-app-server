const PaymentMethod = require('../models/paymentMethodModel');
const paystack = require('../helpers/paystack');
const { PAYMENT_METHOD_USER, PAYMENT_METHOD_CATEGORY, PAYMENT_METHOD_PROVIDER } = require('../config/enums');

/**
 * GET A USER'S PAYMENT METHODS
 *
 * @param {[String]} paymentMethodIDs - Array of payment method IDs
 * @param {"bank"|"card"|"other"} category - Method category
 * @returns {[{__PaymentMethod}]} - List of payment methods
 */
module.exports.getPaymentMethods = async (paymentMethodsIDs, category) => {
	const filter = { _id: paymentMethodsIDs, isDeleted: false };
	if (category) filter.category = category;

	// Find and filter the data
	const paymentMethods = await PaymentMethod.find(filter).sort({ datePosted: -1 });
	return paymentMethods;

	{
		// const data = [];
		// for (let i = 0; i < paymentMethods.length; i++) {
		// 	const paymentMethod = paymentMethods[i];
		// 	switch (paymentMethod.category) {
		// 		case PAYMENT_METHOD_CATEGORY.BANK:
		// 			data.push(filterBankData(paymentMethod));
		// 			break;
		// 		case PAYMENT_METHOD_CATEGORY.CARD:
		// 			data.push();
		// 			break;
		// 		case PAYMENT_METHOD_CATEGORY.OTHER:
		// 			data.push();
		// 			break;
		// 	}
		// 	if (paymentMethod.category === 'bank') data.push(filterBankData(paymentMethod));
		// }
		// res.json(data);
	}
};

/**
 * ADD A PAYMENT METHOD
 *
 * @param {{ type: String, details: {reference}|{__OtherTypeDetails} }} paymentMethodData - Method details
 * @returns {{__PaymentMethod} | {alreadyAdded: true}}
 */
module.exports.addPaymentMethod = async paymentMethodData => {
	const { type, details } = paymentMethodData;
	let data;

	// Add payment method based on provider
	if (type.includes('paystack-authorization')) data = await this.addPaystackAuthorizationMethod(type, details);
	else throw { errMessage: 'Payment method not found' };

	// Prevent duplicate
	if (data.alreadyAdded) return data;

	const newPaymentMethod = await PaymentMethod.create(data);
	return newPaymentMethod;
};

/**
 * SAVE A PAYSTACK PAYMENT METHOD FROM A PAYMENT REFERENCE
 *
 * @param { String } type - Authorization type
 * @param {{ reference }} data - Details
 * @returns {{ method, category, provider, details: {authorization_code, email, __AuthorizationDetails}} | { alreadyAdded: true }}
 */
module.exports.addPaystackAuthorizationMethod = async (type, data) => {
	const { authorization, email, message } = await paystack.verifyPayment(data.reference);
	if (!authorization) throw { errMessage: message };
	if (type === 'paystack-authorization') type = type + '_' + authorization.channel;

	const existing = await PaymentMethod.findOne({ 'details.authorization_code': authorization.authorization_code, isDeleted: false });
	if (existing) return { alreadyAdded: true };

	let details = { authorization_code: authorization.authorization_code, email };
	let category;

	switch (type) {
		case PAYMENT_METHOD_USER.PAYSTACK_AUTHORIZATION_BANK:
			category = PAYMENT_METHOD_CATEGORY.BANK;
			details.last4 = authorization.last4;
			details.account_name = authorization.account_name;
			details.bank_name = authorization.bank;
			break;

		case PAYMENT_METHOD_USER.PAYSTACK_AUTHORIZATION_CARD:
			category = PAYMENT_METHOD_CATEGORY.CARD;
			details.last4 = authorization.last4;
			details.card_type = authorization.card_type;
			details.exp_month = authorization.exp_month;
			details.exp_year = authorization.exp_year;
			break;

		case PAYMENT_METHOD_USER.PAYSTACK_AUTHORIZATION_OTHER:
			category = PAYMENT_METHOD_CATEGORY.OTHER;
			details.channel = authorization.channel;
			break;
	}

	return { method: type, category, provider: PAYMENT_METHOD_PROVIDER.PAYSTACK, details, country: authorization.country_code };
};
