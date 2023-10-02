const Customer = require('../../models/Customer');
const withdrawalMethodModel = require('../../models/withdrawalMethodModel');

/**
 * DELETE WITHDRAWAL METHOD
 *
 * This controller adds a withdrawal method
 */
module.exports = async (req, res, next) => {
	try {
		const { _id } = req.user;
		const { withdrawalMethodID } = req.params;

		// Update the customer
		const newCustomer = await Customer.findByIdAndUpdate(
			{ _id },
			{ $pull: { withdrawalMethods: withdrawalMethodID } },
			{ new: true }
		);
		await withdrawalMethodModel.updateOne({ _id: withdrawalMethodID }, { isDeleted: true });

		res.json(newCustomer);
	} catch (e) {
		next(e);
	}
};
