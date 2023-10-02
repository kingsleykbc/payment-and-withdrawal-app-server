const axios = require('axios');
const { PAYSTACK_API_CONFIG, PAYSTACK_API_DOMAIN } = require('../config');

/**
 * VERIFY A PAYSTACK PAYMENT
 *
 * @param {String} reference - Payment ref.
 * @returns {{isValid: Boolean, message: String, email: String, authorization: {authorizationCode, __AuthorizationData}}}
 */
module.exports.verifyPayment = async reference => {
	try {
		const {
			data: { data }
		} = await axios.get(`${PAYSTACK_API_DOMAIN}/transaction/verify/${reference}`, PAYSTACK_API_CONFIG);

		console.log("\n.\n.\n.\n");
		console.log(data);
		console.log("\n.\n.\n.");

		if (data.authorization && data.authorization.card_type) data.authorization.card_type = data.authorization.card_type.trim();
		return {
			amount: data.amount,
			isValid: data.status === 'success',
			message: data.gateway_response,
			authorization: data.authorization,
			email: data.customer.email
		};
	} catch (e) {
		return { isValid: false, message: e.response.data.message };
	}
};

/**
 * CHARGE AUTHORIZATION
 *
 * @param {Number} amount - Amount
 * @param {String} authorization_code - Paystack Authorization code
 * @param {String} email - Customer's email
 * @return {{ reference, message, status }}
 */
module.exports.chargeAuthorization = async (amount, authorization_code, email) => {
	try {
		const {
			data: { message, data }
		} = await axios.post(
			`${PAYSTACK_API_DOMAIN}/transaction/charge_authorization`,
			{ amount: amount * 100, authorization_code, email, reference: 'REF_' + new Date().getTime() },
			PAYSTACK_API_CONFIG
		);

		console.log('\n.\n.\n.\n');
		console.log(data.amount / 100);
		console.log('\n.\n.\n.');

		// Handle error
		if (data.status === 'failed') {
			let errMessage = `Error charging ${data.channel}`;
			if (data.gateway_response === 'Bank Authorizations cannot currently be directly debited') {
				errMessage = 'Cannot charge saved banks at this time';
			}
			throw { failedError: true, errStatus: 402, errMessage };
		}

		return { message, reference: data.reference, status: data.status };
	} catch (e) {
		if (e.failedError) throw e;
		throw { errMessage: e.response.data.message, errStatus: e.response.status };
	}
};

/**
 * DEACTIVATE AN AUTHORIZATION
 *
 * @param {String} authorization_code - Paystack Auth
 * @return {{status: true, message: "Authorization has been deactivated"}}
 */
module.exports.deactivateAuthorization = async authorization_code => {
	try {
		const { data } = await axios.post(
			`${PAYSTACK_API_DOMAIN}/customer/deactivate_authorization`,
			{ authorization_code },
			PAYSTACK_API_CONFIG
		);
		return data;
	} catch ({ response: { data, status } }) {
		if (data.message === 'Authorization code is already inactive.') return { message: data.message };
		throw { errMessage: data.message, errStatus: status };
	}
};

/**
 * REFUND A CUSTOMER
 *
 * @param {String} transaction - Transaction Reference
 * @returns {{message}} - Refund message
 */
module.exports.refund = async transaction => {
	try {
		const { data } = await axios.post(`${PAYSTACK_API_DOMAIN}/refund`, { transaction }, PAYSTACK_API_CONFIG);
		console.log('\n.\n.\n.\n');
		console.log(data);
		console.log('\n.\n.\n.');
		return { message: data.message };
	} catch (e) {
		throw { errMessage: e.response.data.message, errStatus: e.response.status };
	}
};

/**
 * ADD A PAYSTACK RECIPIENT
 *
 * @param {{type, name, description: 'seller withdrawal'|'user refund', account_number, bank_code, currency }} recipientData
 * @returns {{recipient_code, type, description, account_number, account_name, bank_name, bank_code }}
 */
module.exports.addRecipient = async recipientData => {
	try {
		const {
			data: { data }
		} = await axios.post(`${PAYSTACK_API_DOMAIN}/transferrecipient`, recipientData, PAYSTACK_API_CONFIG);

		return { recipient_code: data.recipient_code, type: data.type, description: data.description, ...data.details };
	} catch (e) {
		throw { errMessage: e.response.data.message, errStatus: e.response.status };
	}
};

/**
 * INITIATE TRANSFER FUNDS TO RECIPIENT
 *
 * @param {{source, reason, recipient, amount}} transferData - Payment data
 * @returns {{message, transfer_code, status}} - Paystack initialization
 */
module.exports.initiateTransfer = async transferData => {
	try {
		transferData.amount = transferData.amount * 100;
		transferData.reference = `tref_${new Date().getTime()}`;
		const {
			data: { data, message }
		} = await axios.post(`${PAYSTACK_API_DOMAIN}/transfer`, transferData, PAYSTACK_API_CONFIG);

		return { message, transfer_code: data.transfer_code, status: data.status };
	} catch (e) {
		throw { errMessage: e.response.data.message, errStatus: e.response.status };
	}
};

/**
 * FINALIZE TRANSFER TO RECIPIENT
 * @param {{transfer_code, ___OTPorOtherAuthData}} authData - Payment data
 * @returns {{message, reason, reference}} - Finalized response
 */
module.exports.finalizeTransfer = async authData => {
	try {
		const {
			data: { data, message }
		} = await axios.post(`${PAYSTACK_API_DOMAIN}/transfer/finalize_transfer`, authData, PAYSTACK_API_CONFIG);

		return { message, reason: data.reason, reference: data.reference };
	} catch (e) {
		console.log(e.response.data);
		throw { errMessage: e.response.data.message, errStatus: e.response.status };
	}
};
