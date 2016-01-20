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
	lender: { type : [{
		user : String,
		amount : 0
		}]},
	group_owner_id: String,
	description: String,
	mode: String,
	date: String,
	linkedFiles: []
	
});

module.exports = mongoose.model('Bill', BillSchema);