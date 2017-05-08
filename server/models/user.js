'use strict';

const mongoose = require('mongoose');
const crypto = require('crypto');

// define the schema for our user model
// role - admin, user
var userSchema = new mongoose.Schema({
	name: String,
	role: {type: String, default: 'user'},
	email: String,
	password: {type: String, minlength: 4, required: true},
	registerDate: {type: Date, default: Date.now},
	lastLoginDate: Date
});

const hashPassword = password => {
	console.log(password);
	return crypto.createHash('sha256').update(password).digest('hex');
};

// Hook a pre save method to hash the password
userSchema.pre('save', function(next) {
	console.log(this);
	this.password = hashPassword(this.password);
	next();
});

// Create instance method for hashing a password
userSchema.methods.hashPassword = hashPassword;

// Create instance method for authenticating user
userSchema.methods.authenticate = function(password) {
	console.log(this.password, hashPassword(password));
	return (this.password === hashPassword(password));
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
