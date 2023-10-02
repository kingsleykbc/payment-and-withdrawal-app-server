const { addWithdrawalMethod } = require('../../utils/withdrawalMethodsFunctions');

/**
 * ADD WITHDRAWAL METHOD
 *
 * This controller adds a withdrawal method.
 * @param {{type, details: {__WithdrawalMethodDetails}}} req
 */
module.exports = async (req, res, next) => {
  try {
    const withdrawalMethod = await addWithdrawalMethod(req.body);
    res.send(withdrawalMethod);
  } catch (e) {
    next(e);
  }
};
