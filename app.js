const express = require('express');
const morgan = require('morgan');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const { handleErrors } = require('./utils/functions');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const { SWAGGER_OPTIONS } = require('./config');
const Auth = require('./routes/authentication');
const Books = require('./routes/books');
const Ads = require('./routes/ads');
const Address = require('./routes/addresses');
const Payments = require('./routes/payments');
const Withdrawals = require('./routes/withdrawals');
const Customer = require('./routes/customers');
const Orders = require('./routes/orders');
const tester = require('./routes/tester');
const { verifyPayment, refundUser } = require('./utils/paymentFunctions');

const CustomerModel = require('./models/Customer');
const AdModel = require('./models/adModel');

require('dotenv').config();
require('./helpers/initMongoDB');

const app = express();
const PORT = process.env.PORT || 3000;
const specs = swaggerJsDoc(SWAGGER_OPTIONS);

// console.log(JSON.stringify(specs))

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));
app.use(cors());
// app.use(helmet());

app.get('/verifyPayment/:reference', async (req, res, next) => {
	try {
		const { reference } = req.params;
		const validation = await verifyPayment('paystack-widget', { reference });
		res.json(validation);
	} catch (e) {
		next(e);
	}
});

app.get('/super', async (req, res, next) => {
	try {
		updateCustomers();
		res.json({ message: 'Happy birthday' });
		updateAds();
	} catch (e) {
		next(e);
	}
});

async function updateCustomers() {
	await CustomerModel.update({}, { $set: { tempField: `Date is ${new Date()}` } }, { multi: true });
}

async function updateAds() {
	await AdModel.updateMany({}, { tempField: `Date is ...  ${new Date().toLocaleTimeString()}` });
}

app.get('/', (req, res) => res.send('Hello world'));
app.use('/auth', Auth);
app.use(Customer);
app.use(Orders);
app.use(Books);
app.use(Ads);
app.use(Address);
app.use(Payments);
app.use(Withdrawals);
app.use(tester);

app.post('/refund/:reference', async (req, res, next) => {
	try {
		const data = await refundUser(req.params.reference);
		res.send(data);
	} catch (e) {
		next(e);
	}
});

app.use(async (req, res, next) => {
	next(createError.NotFound());
});

app.use(async (err, req, res, next) => {
	handleErrors(err, res);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
