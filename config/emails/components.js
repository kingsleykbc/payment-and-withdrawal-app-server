const { DOMAIN } = require('../../config');

/**
 * CSS
 */
module.exports.style = `
  <style type="text/css">
    * {
      margin: 0;
      padding: 0;
      text-decoration: none;
      box-sizing: border-box;
      font-family: Arial, Helvetica, sans-serif;
      text-align: center;
      font-size: 1rem;
    }

    .content {
      max-width: 650px;
      margin: 30px auto;
      border: 2px solid #dddde4;
      padding: 25px;
      padding-top: 0;
      background: #fff;
      border-radius: 5px;
      background-size: 25px;
    }

    .image {
      border-bottom: 1px solid #dddde4;
      margin-bottom: 20px;
      padding-top: 15px;
      padding-bottom: 10px;
    }

    .image img {
      width: 70px;
    }

    .title {
      font-weight: bold;
      margin-bottom: 10px;
      font-size: 1.4rem;
    }

    .message {
      line-height: 29px;
      margin-bottom: 30px;
      color: #7d7e8a;
    }

    .button {
      display: inline-block;
      border-radius: 5px;
      padding: 12px 20px !important;
      color: white !important;
      font-weight: bold;
      background: #5a57ff;
    }

    table {
      border-collapse: collapse;
      width: 100%;
      margin: 20px 0;
    }

    th,td {
      border: 1px solid #c7c7ce;
      padding: 8px 10px;
      text-align: left;
    }

    th {
      color: #000;
    }

    .aRight {
      text-align: right;
      padding: 12px 0;
    }
    
    .highlightedText {
      display: inline-block;
      padding: 3px 12px;
      border-radius: 5px;
      background: #44eebb;
      color: #fff;
      font-weight: bold;
      margin: 5px;
    }

    .bottomOptions {
      text-align: center;
    }

    .bottomOptions a {
      font-size: 0.85rem;
      display: inline-block;
      padding: 10px;
    }
  </style>
`;

/**
 * BUTTON
 */
module.exports.linkButton = (label, url) => `
  <div class="buttonSection">
    <a class="button" href="${url}"> ${label} </a>
  </div>
`;

/**
 * LOBO
 */
module.exports.logo = `
  <div class="image">
    <a href=${DOMAIN} alt="logo">
      <img src="https://res.cloudinary.com/lagos-business-hub/image/upload/v1587383692/lbh/assets/logo_d9jgop.png" alt="LOGO" />
    </a>
  </div>
`;

/**
 * EMAIL WRAPPER
 *
 * This is a general wrapper for the emails.
 * @param {String} title - Message heading
 * @param {String} message - Message
 * @param {{ label, url }} linkButton - Button config for email
 * @param {{ showLogo }} config - Button config for email
 */
module.exports.EMAIL_WRAPPER = (title, message, linkButton, config = {}) => {
	const { showLogo } = config;

	return `
    <html>
    <head>${this.style}</head>
    <body>
      <div class="content">
        ${showLogo === false ? '' : this.logo}
        ${title ? `<div class="title">${title}</div>` : ''}
        <div class="message">${message}</div>
        ${linkButton ? this.linkButton(linkButton.label, linkButton.url) : ''}
      </div>
    </body>
    </html>
  `;
};
