const { getTransactionFee } = require('./paymentFunctions');
const { WITHDRAWAL_METHOD_PROVIDER, PAYMENT_METHOD, PAYMENT_TYPE } = require('../config/enums');
const paystack = require('../helpers/paystack');
const WithdrawalMethod = require('../models/withdrawalMethodModel');
const { generateReceiptNumber } = require('./functions');
const Payment = require('../models/paymentModel');
const Withdrawal = require('../models/withdrawalModel');

// ===================================================================================================================
//  PAYMENTS
// ===================================================================================================================
/**
 * INITIALIZE A 2-WAY WITHDRAWAL USER PAYMENT
 *
 * This is for 2-step user payments/transfers.
 * @param {Number} amount - Amount being paid
 * @param {String} withdrawalMethodID - The withdrawal method ID
 * @param {"User refund" | "Seller withdrawal"} [purpose] - Purpose of paying thr user
 * @returns {{
 * 	message,
 * 	paymentMethod,
 * 	withdrawalMethodID,
 * 	payment: {amount, transactionFee, billerTransactionFee},
 * 	data: {__BillerInitializationFields}
 * }} - Initialization
 */
module.exports.payUser_initiate = async (amount, withdrawalMethodID, purpose) => {
	const { provider, details } = await WithdrawalMethod.findOne({ _id: withdrawalMethodID, isDeleted: false });
	let initialization;

	switch (provider) {
		case WITHDRAWAL_METHOD_PROVIDER.PAYSTACK:
			initialization = await this.initiatePaystackTransfer(amount, details.recipient_code, purpose);
			break;
		default:
			throw { errMessage: 'Withdrawal method not found' };
	}

	initialization.withdrawalMethodID = withdrawalMethodID;
	if (!initialization.message) initialization.message = 'Payment initialized, awaiting data';
	return initialization;
};

/**
 * INITIATE A PAYSTACK TRANSFER
 *
 * @param {Number} amount - Amount being paid
 * @param {String} recipient_code - Paystack recipient code
 * @param {"User refund" | "Seller withdrawal"} purpose - Purpose of paying thr user
 * @returns {{
 * 	message,
 * 	paymentMethod,
 * 	payment: { amount, transactionFee, billerTransactionFee },
 * 	data: { transfer_code, status, message }
 * }} - Paystack initialization
 */
module.exports.initiatePaystackTransfer = async (amount, recipient_code, purpose) => {
	const { amountForBillerCharge, billerFee, amountAfterFees, totalFee } = getTransactionFee(amount, 'withdrawal', 'paystack');

	const data = await paystack.initiateTransfer({
		source: 'balance',
		reason: purpose,
		recipient: recipient_code,
		amount: amountForBillerCharge
	});

	return {
		paymentMethod: PAYMENT_METHOD.PAYSTACK_TRANSFER,
		message: data.message,
		payment: {
			transactionFee: totalFee,
			billerTransactionFee: billerFee,
			amount: amountAfterFees
		},
		data
	};
};

/**
 * FINALIZE A USER'S 2-STEP WITHDRAWAL PAYMENT
 *
 * This function finalizes a payment started by the {@link payUser_initiate} function above.
 * @param {{
 *	message,
 * 	paymentMethod,
 * 	withdrawalMethodID,
 * 	payment: {amount, transactionFee, billerTransactionFee},
 * 	data: {__BillerInitializationFields}
 * }} initialization - Initialization data
 * @param {{ __BillerInitializationValue }} authData - Authentication values
 * @returns {{
 * 	message,
 * 	withdrawalDetails: {
 * 		withdrawalMethodID,
 * 		payment: {type, receiptNo, amount, transactionFee, billerTransactionFee, method, reference, purpose, [message]}
 * 	}
 * }} - Withdrawal details
 */
module.exports.payUser_finalize = async (initialization, authData) => {
	const { paymentMethod, data, payment: paymentDetails, withdrawalMethodID } = initialization;
	let payment;

	// Finalize and setup payment
	switch (paymentMethod) {
		case PAYMENT_METHOD.PAYSTACK_TRANSFER:
			payment = await this.finalizePaystackTransfer(data.transfer_code, authData);
			break;
		default:
			throw { errMessage: 'Withdrawal method not found' };
	}
	payment = { type: PAYMENT_TYPE.OUTGOING, receiptNo: generateReceiptNumber(), ...paymentDetails, ...payment };

	// Return withdrawal object
	return { message: payment.message || 'Payment sent', withdrawalDetails: { withdrawalMethodID, payment } };
};

/**
 * FINALIZE A PAYSTACK TRANSFER
 *
 * @param {String} transfer_code - Transfer code for the initialized transaction
 * @param {{ __OTPorOtherAuthData }} authData - Auth body/payload
 * @returns {{method, reference, purpose, message}} - Parts of the payment object
 */
module.exports.finalizePaystackTransfer = async (transfer_code, authData) => {
	const { reason: purpose, reference, message } = await paystack.finalizeTransfer({ transfer_code, ...authData });
	return { reference, purpose, message, method: PAYMENT_METHOD.PAYSTACK_TRANSFER };
};

/**
 * (NOTE: This function currently isn't in use because paystack is the only withdrawal method allowed, and its withdrawal
 * process is a 2-step system)
 *
 * PAY A USER // TODO: For vybite, add a userType property
 *
 * This is for 1-step user payments/transfers.
 * @param {String} withdrawalMethodID - The withdrawal method ID
 * @param {"User refund" | "Seller withdrawal"} purpose - Purpose of paying thr user
 * @returns {{__PaymentData}} - Payment data (From the providers)
 */
module.exports.payUser = async (withdrawalMethodID, purpose) => {
	const { provider, details } = await withdrawalMethodModel.findOne({ _id: withdrawalMethodID });
	let data;

	// TODO: Add 2-step payment functions here
	switch (provider) {
		default:
			throw { errMessage: 'Withdrawal method not found' };
	}
	return data;
};

/**
 * CREATE WITHDRAWAL FROM DETAILS OBJECT
 *
 * @param {{ withdrawalMethodID, payment: {__PaymentData}}} withdrawalDetails - Details Object
 * @param {String} customerID - Customer's ID
 * @param {{email}|{phoneNumber}} [authField] - Optional OTP authenticated field
 * @returns {{__Withdrawal}} - New withdrawal
 */
module.exports.createWithdrawalFromDetailsObject = async (withdrawalDetails, customerID, authField) => {
	const {
		withdrawalMethodID,
		payment,
		payment: { amount, transactionFee }
	} = withdrawalDetails;

	// Save the payment (You can verify in future if needed)
	const { _id: paymentID } = await Payment.create(payment);

	console.log('Payment made', paymentID);

	// Save withdrawal
	const data = {
		totalAmount: amount + transactionFee,
		totalAmountWithoutFees: amount,
		paymentID,
		withdrawalMethodID,
		customerID
	};
	if (authField) data.authField = authField;
	const withdrawal = await Withdrawal.create(data);

	return withdrawal;
};
