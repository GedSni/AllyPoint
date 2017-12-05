const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create Schema and model
const CountrySchema = new Schema({
	avatar: String,
	name: {
		type: String,
		required: [true, 'Name field is required']
	}
});

const Country = mongoose.model('country', CountrySchema);

module.exports = Country;