const { TooManyRequests } = require('http-errors');
const mongoose = require('mongoose');
const { VENDOR_NAMES } = require('../config');
const { getAd } = require('../routes/test');
const Schema = mongoose.Schema;

module.exports.subSchema = new Schema(
	{
		food: {
			type: String,
			required: true
		},
		calories: Number,
		quantity: { type: String, required: true },

		settings: {
			useKG: { type: Boolean, default: true }
		}
	},
	{
		timestamps: {
			createdAt: 'datePosted',
			updatedAt: 'updatedAt'
		}
	}
);

//
// JOB REQUEST SCHEMA
//
const AdSchema = new Schema(
	{
		vendor: { type: String, enum: [...Object.values(VENDOR_NAMES)], required: true, trim: true },
		expiryDate: { type: Date, default: new Date(), set: v => new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000) },
		dateField: Date,
		favs: [{ type: String, enum: ['app', 'bat'] }],
		favs2: { type: [String], enum: ['app', 'bat'] },
		message: String,
		subDoc: this.subSchema,
		friends: [{ name: { type: String, required: true }, age: Number }],
		multiSubDoc: [this.subSchema],
		sort: { type: Number, enum: [1, 2, 3], required: true },
		nesDoc: {
			name: String,
			age: Number,
			color: {
				type: String,
				required: true,
				lowercase: true,
				trim: true,
				enum: ['red', 'green']
			},
			lastUpdated: { type: Date, default: new Date(), set: v => new Date() }
		},
		boolField: { type: Boolean, required: true, default: false },
		url: [{ type: String, enum: ['MASTER', 'READ_ALL', 'WRITE_ALL', 'SEND_MAILS', 'POST_ADS', 'POST_CHIPS', 'POST_LISTS'] }],
		meta: {
			type: Object,
			enum: [
				{ name: String, balance: { type: Number, required: true } },
				{ animal: String, weight: { type: Number, required: true } }
			],
			required: true
		},
		normal: { type: Object, default: {} },
		numberField: Number,
		uniqueField: { type: String, unique: true },
		tempField: String
	},
	{
		// Timestamps
		timestamps: {
			createdAt: 'datePosted',
			updatedAt: 'updatedAt'
		}
	}
);

module.exports = mongoose.model('DeleteLater', AdSchema);

/**
 * 
AdSchema.statics.getUserData = async function (_id) {
  const user = await this.findOne({ _id });
  console.log("running here", typeof getAd)
  const otherData = await getAd();
  console.log({otherData})
  return user;
};

AdSchema.pre('save', async function (next) {
  console.log('\n.\n');
  console.log('SAVE SCHEMA');
  console.log({ thisFull: this });
  console.log('\n.');
  next();
});

AdSchema.pre('save', async function (next) {
  console.log('\n.\n');
  console.log('SAVE SCHEMA (SECOND CALL)');
  console.log({ thisFull: this });
  console.log('\n.');
});

AdSchema.pre('update', async function (next) {
  console.log('\n.\n');
  console.log('UPDATE SCHEMA');
  console.log('\n.');
});

AdSchema.pre('updateOne', async function (next) {
  console.log('\n.\n');
  console.log('UPDATE ONE SCHEMA');
  console.log('\n.');
});

AdSchema.pre('save, updateOne', async function (next) {
  console.log('\n.\n');
  console.log('SAVE AND UPDATE ONE SCHEMA');
  console.log('\n.');
});

AdSchema.pre('updateOne, updateMany', async function (next) {
  console.log('\n.\n');
  console.log('UPDATE ONE AND UPDATE MANY SCHEMA');
  console.log('\n.');
});

AdSchema.pre('findOneAndUpdate', async function (next) {
  // const data = await this.fineOne();
  const data = null;

  console.log('\n.\n');
  console.log('FIND ONE AND UPDATE SCHEMA');
  console.log({ thisFull: this, data });
  console.log('\n.');
});

AdSchema.pre('findOneAndUpdate', async function (next) {
  const data = await this.fineOne();

  console.log('\n.\n');
  console.log('FIND ONE AND UPDATE (SECOND CALL)');
  console.log({ thisFull: this, data });
  console.log('\n.');
});

AdSchema.pre('findOne', async function (next) {
  // const data = await this.fineOne();
  const data = null;
  this.nesDoc = 'SUS';

  console.log('\n.\n');
  console.log('FIND ONE SCHEMA');
  console.log({ thisFull: this.doc, data });
  console.log('\n.');
});

//
// JOB REQUEST SCHEMA
//
const AdSchema = new Schema({
  vendor: {
    type: String,
    required: [true, "Vendor required"]
  },
  description: {
    type: String,
    required: [true, "Vendor required"]
  },
  poster: {
    type: String,
  },
  expiryDate: {
    type: Date,
    required: [true, "Expiry date required"]
  },
  url: {
    type: String,
    required: [true, "URL is required"]
  }
},
  {
    // Timestamps
    timestamps: {
      createdAt: "datePosted",
      updatedAt: "updatedAt"
    }
  });
*/
// module.exports = mongoose.model('DeleteLater', AdSchema);
