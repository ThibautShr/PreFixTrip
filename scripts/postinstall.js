"use strict";

var User = require("../api/users/users.model");
var Group = require("../api/group/group.model.model");
var passport = require("../server/auth/local/passport");
var config = require("../server/config/environment");
var jwt = require("jsonwebtoken");

function makeUser(userBody){
	var newUser = new User(userBody);
	newUser.save(function(err, user) {
		if (err) return validationError(res, err);
		var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
		res.json({ token: token });
	});
}

var users = [{"pseudo": "titi",
			  "email": "titi@gmail.com",
			  "password" : "titi",
			  "paypal" : ""
			},{
			  "pseudo": "toto",
			  "email": "toto@gmail.com",
			  "password" : "toto",
			  "paypal" : ""
			},{
			  "pseudo": "tutu",
			  "email": "tutu@gmail.com",
			  "password" : "tutu",
			  "paypal" : ""
			},{
			  "pseudo": "tata",
			  "email": "tata@gmail.com",
			  "password" : "tata",
			  "paypal" : ""}]

for(var i=0; i<users.length; ++i){
	makeUser(users[i]);
}