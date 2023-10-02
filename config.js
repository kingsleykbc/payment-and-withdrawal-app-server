require('dotenv').config();

module.exports = {
	COOKIE_MAX_AGE: 3 * 24 * 60 * 60 * 1000,

	SWAGGER_OPTIONS: {
		definition: {
			openapi: '3.0.0',
			info: {
				title: 'Node security API test',
				version: '1.0.0',
				description: 'A simple node and express API'
			}
		},
		servers: ['http://localhost:8080', 'http://localhost:8089'],
		apis: ['./routes/*.js', './docs/*.js']
	},

	VENDOR_NAMES: {
		suleman: 'SULEMAN',
		tyt: 'TYT'
	},

	PAYSTACK_API_DOMAIN: 'https://api.paystack.co',
	PAYSTACK_API_CONFIG: {
		headers: { Authorization: `Bearer ${process.env.TEST_SECRET_KEY}` }
	},

	PAYMENT_CONFIG: {
		RATE: 5,
		PHYSICAL_RATE: 2,
		WITHDRAWAL_RATE: 0,
		ADDITIONAL_FEE: 100,
		MIN_AMOUNT_FOR_ADDITIONAL_FEE: 1000
	},

	DOMAIN: 'http://localhost:3000',

	MAILGUN_CONFIG: {
		apiKey: process.env.MAILGUN_API_KEY,
		domain: process.env.MAILGUN_DOMAIN,
		host: process.env.MAILGUN_HOST
	},

	TWILIO_CONFIG: {
		sid: process.env.TWILIO_SID,
		authToken: process.env.TWILIO_AUTH_TOKEN
	}
};
