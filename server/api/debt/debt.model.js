// JavaScript Document
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DebtSchema = new Schema({
	lender: String,
	endebted: String,
	amount: 0,
	transactions: [],
	list_bill_amount : { type : [{
		bill : String,
		amount : 0
		}
	]}
	
});

module.exports = mongoose.model('Debt', DebtSchema);