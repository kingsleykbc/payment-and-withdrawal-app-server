const express = require('express');
const { Types } = require('mongoose');
const { getBooks } = require('../controllers/books');
const app = express.Router();
const AdModel = require('../models/adModel');
const { createUpdateObject } = require('./test');
const Day = require('dayjs');

// ===================================================================================================================
//  GET ADS
// ===================================================================================================================
app.get('/ads', async (req, res, next) => {
	try {
		let data = await AdModel.find({}, { multiSubDoc: 0, nesDoc: 0 });
		res.json(data);
	} catch (e) {
		next(e);
	}
});

// ===================================================================================================================
//  GET AD
// ===================================================================================================================
const handleUpdate = async ad => {
	const { friends, multiSubDoc } = ad;

	for (let i = 0; i < friends.length; i++) {
		const { age } = friends[i];
		if (age === 10) ad.age = 5000;
	}

	for (let i = 0; i < multiSubDoc.length; i++) {
		const { food } = multiSubDoc[i];
		if (food === 'gum') ad.food = 'cheeder bob';
	}

	await ad.save();
	return ad;
};

app.get('/ads/:id', async (req, res, next) => {
	try {
		let data = await AdModel.aggregate([{ $group: { _id: null, sum: { $sum: '$numberField' } } }]);
		// data = await handleUpdate(data);
		res.send(data);
	} catch (e) {
		next(e);
	}
});

app.post('/ads', async (req, res) => {
	try {
		req.body.dateField = Day();
		req.body.message = Day();
		const newAd = await AdModel.create(req.body);
		res.json(newAd);
	} catch (e) {
		res.send(e.message);
	}
});

/**
 * HANDLE UPDATING DOCUMENT (ADDING SUB)
 */
app.post('/ads/multi/:id', async (req, res) => {
	try {
		// const newAd = await AdModel.findOneAndUpdate({ 'multiSubDoc._id': req.params.id }, { 'multiSubDoc.$.food': 'Dodo' }, { new: true });
		const newAd = await AdModel.findOneAndUpdate({ _id: req.params.id }, { $push: { multiSubDoc: req.body } }, { new: true });
		res.json({ _id: newAd._id, multiSubDoc: newAd.multiSubDoc });
	} catch (e) {
		res.send(e.message);
	}
});

app.put('/ads/:id', async (req, res) => {
	try {
		let filter = { _id: req.params.id };

		// UPDATE WITH UPDATE
		// const updateResponse = await AdModel.updateMany(
		//   filter,
		//   { subDoc: { calories: 13 } }
		//   // { multi: true }
		// );

		// const updatedAd = await AdModel.findOne(filter);
		// updatedAd.nesDoc.age = 300;
		// await updatedAd.save();

		// UPDATE WITH FIND AND SAVE
		// await updatedAd[0].update({subDoc: { num: 99009 }});

		// UPDATE WITH FIND ONE AND UPDATE
		// const data = req.body;
		// if (data.vendor === 'superman') data.subDoc['settings.useKG'] = true;

		// const updateData = createUpdateObject(data);
		// const updatedAd = await AdModel.findOneAndUpdate(filter, updateData, { new: true });

		res.json(updatedAd);

		Customer.updateOne({ _id: 1, 'books._id': '1a' }, { $set: { 'books.$.rating': 2 } });
		Customer.updateOne({ _id: 1, 'books._id': '1a' }, { 'books.$.rating': 2 });
	} catch (e) {
		res.send(e.message);
	}
});

module.exports = app;
