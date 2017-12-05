const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create Schema and model
const UserSchema = new Schema({
	username: {
		type: String,
		required: [true, 'Username field is required']
	},
	password: {
		type: String,
		required: [true, 'Password field is required']
	},
	email: {
		type: String,
		required: [true, 'E-mail field is required']
	},
	country: {
		type: String,
		required: [true, 'Country field is required']
	},
	available: {
		type: Boolean,
		default: true
	},
	avatar: {
		type: String,
		default: "lt.png"
	},
	game:{
		type: [Schema.ObjectId],
		ref: 'game'
	},
	friend:{
		type: [Schema.ObjectId],
		ref: 'user'
	}
});

const User = mongoose.model('user', UserSchema);

module.exports = User;