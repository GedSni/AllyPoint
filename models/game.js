const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create Schema and model
const GameSchema = new Schema({
	name: {
		type: String,
		required: [true, 'Name field is required']
	},
	category:{
		type: Schema.ObjectId,
		ref: 'category',
		required: [true, 'Category field is required']
	}
});

const Game = mongoose.model('game', GameSchema);

module.exports = Game;