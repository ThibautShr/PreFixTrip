'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var User = require('../user/user.model');
var Group = require('./group.model');

var user1 = new User({
	email: "test@test.com",
	password: "test",
	_id : "User0" 
});

var testGroups1 = new Group({
	name: "TestGroup",
	users : [],
	_id : "Group0" 
});

describe('GET /api/group', function() {
	before(function(done) {
		Group.remove().exec().then(function() {
			done();
		});
		user1.save();
	});
	
	afterEach(function(done) {
		Group.remove().exec().then(function() {
			done();
		});
	});
	
	it('should respond with JSON array', function(done) {
		request(app)
		.get('/api/group')
		.expect(200)
		.expect('Content-Type', /json/)
		.end(function(err, res) {
			if (err) return done(err);
			res.body.should.be.instanceof(Array);
			done();
		});
	});
});
