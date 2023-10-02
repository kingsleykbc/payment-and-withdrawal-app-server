module.exports = {
	// ===================================================================================================================
	//  PAYMENT
	// ===================================================================================================================

	PAYMENT_TYPE: {
		INCOMING: 'Incoming',
		OUTGOING: 'Outgoing'
	},

	PAYMENT_METHOD: {
		PAYSTACK_CHARGE: 'Paystack charge',
		PAYSTACK_TRANSFER: 'Paystack transfer',
		PHYSICAL: 'Physical'
	},

	PAYMENT_PURPOSE: {
		ORDER_PAYMENT: 'Order payment',
		USER_REFUND: 'User refund',
		SELLER_WITHDRAWAL: 'Seller withdrawal'
	},

	// ===================================================================================================================
	//  PAYMENT METHOD
	// ===================================================================================================================

	PAYMENT_METHOD_USER: {
		PAYSTACK_AUTHORIZATION_CARD: 'paystack-authorization_card',
		PAYSTACK_AUTHORIZATION_BANK: 'paystack-authorization_bank',
		PAYSTACK_AUTHORIZATION_OTHER: 'paystack-authorization_other'
	},

	PAYMENT_METHOD_CATEGORY: {
		BANK: 'bank',
		CARD: 'card',
		OTHER: 'other'
	},

	PAYMENT_METHOD_PROVIDER: {
		PAYSTACK: 'paystack'
	},

	// ===================================================================================================================
	//  WITHDRAWAL METHOD
	// ===================================================================================================================

	WITHDRAWAL_METHOD_PROVIDER: {
		PAYSTACK: 'paystack'
	},

	WITHDRAWAL_METHOD: {
		PAYSTACK_RECIPIENT_NUBAN: 'paystack-recipient_nuban'
	},

	WITHDRAWAL_METHOD_PURPOSE: {
		SELLER_WITHDRAWAL: 'Seller withdrawal',
		USER_REFUND: 'User refund'
	},

	WITHDRAWAL_METHOD_CATEGORY: {
		BANK: 'bank',
		CARD: 'card',
		OTHER: 'other'
	}
};
