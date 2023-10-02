const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const CustomerSchema = new Schema(
	{
		name: {
			type: String,
			required: true
		},

		email: {
			type: String,
			required: true,
			lowercase: true,
			unique: true
		},

		password: {
			type: String,
			required: true
		},

		phoneNumber: String,

		isVerified: {
			type: Boolean,
			default: false
		},

		isPhoneVerified: {
			type: Boolean,
			default: false
		},

		tempField: String,

		paymentMethods: [mongoose.Types.ObjectId],
		withdrawalMethods: [mongoose.Types.ObjectId]
	},
	{ timestamps: true }
);

/**
 * HASH PASSWORD BEFORE SAVING
 */
CustomerSchema.pre('save', async function (next) {
	try {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(this.password, salt);
		this.password = hashedPassword;
		next();
	} catch (e) {
		next(e);
	}
});

/**
 * HANDLE CUSTOMER LOGIN
 */
CustomerSchema.statics.login = async function (email, password) {
	const user = await this.findOne({ email });
	if (user) {
		const passwordValid = await bcrypt.compare(password, user.password);
		if (passwordValid) return user;
	}
	throw { errType: 'form error', errMessage: 'Username/password not valid' };
};

const Customer = mongoose.model('customer', CustomerSchema);
module.exports = Customer;
