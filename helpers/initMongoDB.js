const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true })
 .then(()=> console.log("Mongo DB Connected"))
 .catch(e => console.log("Error connecting to Mongo DB: ", e.message));

// mongoose.connection.close();