const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddressSchema = new Schema(
  {
    address: { type: String, required: true },
    state: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    landmark: String,
    postcode: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('addresstest', AddressSchema); //Address
