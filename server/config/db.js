const mongoose = require('mongoose');

async function connectToDB() {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log('MongoDB Connected Successfully');
	} catch (error) {
		console.error(error.message);
		process.exit(1);
	}
}

module.exports = connectToDB;
