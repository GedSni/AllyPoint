const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create Schema and model
const CategorySchema = new Schema({
	name: {
		type: String,
		required: [true, 'Name field is required']
	}
});

const Category = mongoose.model('category', CategorySchema);

module.exports = Category;