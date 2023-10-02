const Address = require('../../models/addressModel');

/**
 * UPDATE ADDRESS
 *
 * This controller handles updating an address. It is also used by the @User entity.
 * @param {{params:{addressID}, body: {__UpdateData}}} req - Address ID
 * @returns {{address, state, phoneNumber, landmark, postcode }} - Updated Address
 */
module.exports = async (req, res, next) => {
  try {
    const { addressID } = req.params;

    const newVendor = await Address.findOneAndUpdate({ _id: addressID }, req.body, { new: true });
    res.json(newVendor);
  } catch (e) {
    next(e);
  }
};
