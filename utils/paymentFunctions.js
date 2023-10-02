const {
	PAYMENT_CONFIG: { PHYSICAL_RATE, MIN_AMOUNT_FOR_ADDITIONAL_FEE, ADDITIONAL_FEE, WITHDRAWAL_RATE, RATE }
} = require('../config');
const { PAYMENT_METHOD, PAYMENT_METHOD_PROVIDER } = require('../config/enums');
const paystack = require('../helpers/paystack');
const PaymentMethod = require('../models/paymentMethodModel');
const { generateReceiptNumber } = require('./functions');
const Payment = require('../models/paymentModel');

// ===================================================================================================================
//  PAYMENT
// ===================================================================================================================
/**
 * CHARGE A USER
 *
 * This function charges a payment method and returns a payment details object.
 * @param {Number} amount - Amount
 * @param {String} paymentMethodID - Payment method ID
 * @returns {{
 * 	method: "Paystack charge"|"Paystack transfer",
 * 	data: Object,
 * 	amount: {amount, billerFee, amountForBillerCharge, amountAfterFees, totalFee, appFee }
 * }}
 */
module.exports.chargeUser = async (amount, paymentMethodID) => {
	const { provider, details } = await PaymentMethod.findOne({ _id: paymentMethodID, isDeleted: false });
	let paymentDetails;

	switch (provider) {
		case PAYMENT_METHOD_PROVIDER.PAYSTACK:
			paymentDetails = await this.chargePaystackAuthorization(amount, details.authorization_code, details.email);
			break;
		default:
			throw { errMessage: 'Payment method not found' };
	}
	return paymentDetails;
};

/**
 * CHARGE A PAYSTACK AUTHORIZATION
 *
 * @param {Number} totalAmount - Amount to charge
 * @param {String} authorization_code - The paystack authorization code
 * @param {String} email - Paystack customer email
 * @return {{
 *	method: "Paystack charge"|"Paystack transfer",
 *	provider: "paystack",
 * 	data: {reference},
 * 	amount: {amount, billerFee, amountForBillerCharge, amountAfterFees, totalFee, appFee }
 * }}
 */
module.exports.chargePaystackAuthorization = async (totalAmount, authorization_code, email) => {
	const amount = this.getTransactionFee(totalAmount, 'payment', 'paystack');
	const { reference } = await paystack.chargeAuthorization(amount.amountForBillerCharge, authorization_code, email);
	return { method: PAYMENT_METHOD.PAYSTACK_CHARGE, provider: PAYMENT_METHOD_PROVIDER.PAYSTACK, data: { reference }, amount };
};

/**
 * CREATE A NEW PAYMENT FROM PAYMENT DETAILS OBJECT
 *
 * @param {{method, data, provider, amount: {amount, billerFee, amountForBillerCharge, amountAfterFees, totalFee, appFee}}} payment - Details
 * @param {String} purpose - Purpose
 * @param {'Incoming'|'Outgoing'} type - Payment type
 * @returns {{__NewPayment}} - Created Payment
 */
module.exports.createPaymentFromDetailsObject = async (payment, purpose, type = 'Incoming') => {
	const { method, data, amount, provider } = payment;
	const paymentData = {
		type,
		method,
		purpose,
		provider,
		receiptNo: generateReceiptNumber(),
		amount: amount.amountAfterFees,
		transactionFee: amount.totalFee,
		billerTransactionFee: amount.billerFee
	};

	// Validate and return paystack ref
	const getPaystackRef = async reference => {
		const existingPayment = await Payment.findOne({ reference });
		if (existingPayment) throw { errStatus: 409, errMessage: 'Payment reference already exists' };
		else return reference;
	};

	switch (method) {
		case PAYMENT_METHOD.PAYSTACK_CHARGE:
			paymentData.reference = await getPaystackRef(data.reference);
			break;
		case PAYMENT_METHOD.PAYSTACK_TRANSFER:
			paymentData.reference = await getPaystackRef(data.reference);
			break;
		case PAYMENT_METHOD.PHYSICAL:
			break;
		default:
			throw { errMessage: 'Method not found' };
	}

	const newPayment = await Payment.create(paymentData);
	return newPayment;
};

// ===================================================================================================================
//  REFUND
// ===================================================================================================================
/**
 * AUTO-REFUND A CUSTOMER
 * @param {String} reference - Transaction Reference
 * @returns {{message}} - Message
 */
module.exports.refundUser = async reference => {
	const { provider = PAYMENT_METHOD_PROVIDER.PAYSTACK } = await Payment.findOne({ reference });
	let message;
	if (provider === PAYMENT_METHOD_PROVIDER.PAYSTACK) message = await paystack.refund(reference);
	return message;
};

// ===================================================================================================================
//  VALIDATION
// ===================================================================================================================

/**
 * VERIFY A USER'S PAYMENT
 *
 * @param {"Paystack charge"|"Paystack transfer"} method - The payment method
 * @param {{reference}} data - The options for the method
 * @returns {{isValid, message}} - Validation
 */
module.exports.verifyPayment = async (method, data = {}) => {
	let validation = { isValid: false, message: 'Payment method not found' };
	if (method === 'paystack-widget') validation = await paystack.verifyPayment(data.reference);
	return validation;
};

// ===================================================================================================================
//  CALCULATIONS
// ===================================================================================================================

/**
 * CALCULATE THE TRANSACTION FEES OF A PAYMENT
 *
 * @param {Number} amount - Amount (in naira)
 * @param {"withdrawal"|"payment"|"physical payment"} type - Type of payment (withdrawal or charge/payment)
 * @param {"paystack"|"physical"} provider - Biller
 * @param {{ inKobo: Boolean }} options - Options
 * @returns {{ amount, billerFee, amountForBillerCharge, amountAfterFees, totalFee, appFee }}
 */
module.exports.getTransactionFee = (amount, type, provider, options = {}) => {
	let totalFee = this.getTotalTransactionFee(type, amount);
	let billerFee;
	if (options.inKobo) amount = amount * 100;

	switch (provider) {
		case 'paystack': {
			billerFee = this.getPaystackTransactionFee(type, amount);
			break;
		}
		default: {
			billerFee = 0; // For physical payments
		}
	}

	if (billerFee > totalFee) totalFee = billerFee;
	const appFee = totalFee - billerFee;
	return {
		amount,
		billerFee,
		totalFee,
		appFee,
		amountForBillerCharge: type === 'withdrawal' ? amount - appFee : amount,
		amountAfterFees: amount - totalFee
	};
};

/**
 * GET THE TRANSACTION FEE
 *
 * @param {"withdrawal"|"payment"|"physical payment"} type - Type of transaction (outgoing = transfer, incoming = charge)
 * @param {Number} amount - Amount (in naira)
 * @returns {Number} - Paystack fee
 */
module.exports.getTotalTransactionFee = (type, amount) => {
	let fee = 0;

	switch (type) {
		case 'payment':
			if (amount > MIN_AMOUNT_FOR_ADDITIONAL_FEE) fee += ADDITIONAL_FEE;
			fee += amount * (RATE / 100);
			break;
		case 'physical payment':
			fee += amount * (PHYSICAL_RATE / 100);
			break;
		case 'withdrawal':
			fee += amount * (WITHDRAWAL_RATE / 100);
			break;
	}

	return fee;
};

/**
 * GET THE TRANSACTION FEE OF A PAYSTACK TRANSACTION
 *
 * @param {"withdrawal"|"payment"|"physical payment"} type - Type of transaction (outgoing = transfer, incoming = charge)
 * @param {Number} amount - Amount (in naira)
 * @returns {Number} - Paystack fee
 */
module.exports.getPaystackTransactionFee = (type, amount) => {
	let fee = 0;

	switch (type) {
		case 'payment':
			if (amount >= 2500) fee += 100;
			fee += amount * 0.015;
			break;
		case 'withdrawal':
			fee += amount <= 5000 ? 10 : amount > 5000 && amount <= 50000 ? 25 : 50;
			break;
	}

	return fee;
};
