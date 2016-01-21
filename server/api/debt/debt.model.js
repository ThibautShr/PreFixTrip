// JavaScript Document
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DebtSchema = new Schema({
	lender: { type : String, required: true},
	indebted: { type : String, required: true},
	amount: 0,
	transactions: {type : [{ 
		bill : String,
		amount : 0
	}]},
	list_bill_amount : { type : [{
		bill : String,
		amount : 0
		}
	]}
	
});

module.exports = mongoose.model('Debt', DebtSchema);