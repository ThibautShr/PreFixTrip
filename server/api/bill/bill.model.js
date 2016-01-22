// JavaScript Document
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BillSchema = new Schema({
	payed: String,
	title: String,
	amount: 0,
	indebted: { type : [{
		user : String,
		amount : 0
		}]},
	lenders: { type : [{
		user : String,
		amount : 0,
		part: 0
		}]},
	acquitted: { type : [{
		user : String
	}]},
	group_owner_id: String,
	description: String,
	mode: String,
	linkedFiles: []
	
});

module.exports = mongoose.model('Bill', BillSchema);