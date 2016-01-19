'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GroupSchema = new Schema({
	name: String,
	password: String,
	users: {
		type: [{
				pseudo : String,
				email : String,
				role : String
				}]
			}
});

module.exports = mongoose.model('Group', GroupSchema);
