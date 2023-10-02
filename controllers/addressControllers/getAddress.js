const Address = require('../../models/addressModel');

/**
 * GET ADDRESS DETAILS
 *
 * This controller simply returns an address.
 * @param {{params:{addressID}}} req - Address ID
 * @returns {{address, state, phoneNumber, landmark, postcode }} - Address
 */
module.exports = async (req, res, next) => {
  try {
    const { addressID } = req.params;
    let address = await Address.findOne({ _id: addressID });
    res.json(address);
  } catch (e) {
    next(e);
  }
};
