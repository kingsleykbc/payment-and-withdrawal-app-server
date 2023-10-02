const { deleteAddress } = require("../../utils/addressFunctions/deleteAddressFunctions");

/**
 * DELETE ADDRESS
 *
 * THis controller deletes an address if it isn't is use by the order and user entities.
 * @param {{params:{addressID: String}}} req - Address ID
 * @returns {{__DeletedAddress}}
 */
module.exports = async (req, res, next) => {
  try {
    const { addressID } = req.params;
    const deletedAddress = await deleteAddress(addressID);
    const data = deletedAddress === 'Address in use' ? { message: deletedAddress } : deletedAddress;
    res.json(data);
  } catch (e) {
    next(e);
  }
};
