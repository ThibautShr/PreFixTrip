// JavaScript Document
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BillSchema = new Schema({
	title: String,
	amount: 0,
	indebted: [],
	lender: [],
	group_owner_id: String,
	description: String,
	mode: String,
	date: String,
	linkedFiles: []
	
});

module.exports = mongoose.model('Bill', BillSchema);