const { DOMAIN } = require('../../config');

/**
 * ORDER PLACED EMAIL
 */
module.exports = ({ orderNo, quantity, productName, customerPhoneNumber }) => `A customer has placed an order!
- Item: ${productName}${quantity > 1 ? ` (x${quantity})` : ''}
- Contact number: ${customerPhoneNumber}

See order details: ${DOMAIN}/dashboard/orders/${orderNo}`;
