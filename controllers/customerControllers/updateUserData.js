const Customer = require('../../models/Customer');

/**
 *  UPDATE USER DATA
 */
module.exports = async (req, res, next) => {
	try {
		const { _id, email } = req.user;
		const data = req.body;

		// VERIFY EMAIL
		if (data.email) {
			const exists = await Customer.findOne({ email: data.email });
			if (exists) throw { errMessage: data.email === email ? 'Already your email' : 'Email taken' };
			else {
				data.isVerified = false;
			}
		}

		// VERIFY PHONE
		if (data.phoneNumber) data.isPhoneVerified = false;

		const updatedUser = await Customer.findOneAndUpdate({ _id }, req.body, { new: true });
		res.json(updatedUser);
	} catch (e) {
		next(e);
	}
};
