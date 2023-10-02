const Address = require('../../models/addressModel');
const Payment = require('../../models/paymentModel');
const mongoose = require('mongoose');

/**
 * DELETE ADDRESS
 *
 * This function deletes an address if its not in use by any of the entities.
 * @param {String} addressID - Address ID
 * @returns {("Address in use" | {__DeletedAddress})} - The deleted address or "in use" message
 */
module.exports.deleteAddress = async addressID => {
	addressID = mongoose.Types.ObjectId(addressID);

	// Check payment records
	const paymentRecordExists = await Payment.findOne({ billingAddressID: addressID });
	if (paymentRecordExists) return 'Address in use by payment records';

	// Delete if not in use
	const deletedAddress = await Address.findOneAndDelete({ _id: addressID });
	return deletedAddress;
};
