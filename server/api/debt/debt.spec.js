'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var User = require('../user/user.model');
var Group = require('../group/group.model');
var Bill = require('../bill/bill.model');
var Debt = require('./debt.model');

var Debt = new Debt({
	
	lender: "User1",
	indebted: "User2",
	amount: 1,
	transactions: [],
	list_bill_amount : [{
		bill : "Bill1",
		amount : 0
		}]
	
});

var bill1 = new Bill( {
	title: "Test Bill",
	amount: 1,
	indebted: ["User2"],
	lenders: [],
	group_owner_id: "Group0",
	description: "description test",
	mode: 1,
	date: "20/01/2016"
});

var testGroups1 = new Group({
	name: "TestGroup",
	users : [],
	_id : "Group0" 
});

var user1 = new User({
	email: "test@test.com",
	password: "test",
	_id : "User1" 
});

var user2 = new User({
	email: "test2@test.com",
	password: "test2",
	_id : "User2" 
});

describe('GET /api/bill', function() {
	before(function(done) {
		Debt.remove().exec().then(function(){
			done();	
		});
		
		user1.save();
		user2.save();
		testGroups1.save();
		bill1.save();
	});
	
	afterEach(function(done) {
		Debt.remove().exec().then(function() {
			done();
		});
	});
	
	it('should respond with JSON array', function(done) {
		request(app)
		.get('/api/bill')
		.expect(200)
		.expect('Content-Type', /json/)
		.end(function(err, res) {
			if (err) return done(err);
			res.body.should.be.instanceof(Array);
			done();
		});
	});
});
// JavaScript Document