const { LBH_DOMAIN } = require('../../config/config');
const { EMAIL_WRAPPER } = require('./components');

/**
 * ORDER PLACED EMAIL 
 */
module.exports = ({ orderNo, productName, productImage, customerName, customerPhoneNumber }) => EMAIL_WRAPPER(
  "You got an order!",
  ` A customer has placed an order for <b>${productName}</b>. Please visit your dashboard ${`to`} view the details.
    <br/>
    <img class="product" src="${productImage}" width="200px" />
    <br/>
    <ul>
      <li>Customer name: ${customerName}</li>
      <li>Customer phone number: ${customerPhoneNumber}</li>
    </ul>
    <br/>
    Thank you.  
  `,
  { label: "View Order", url: `${LBH_DOMAIN}/dashboard/orders/${orderNo}` }
);
