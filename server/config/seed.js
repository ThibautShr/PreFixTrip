/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/users/users.model');
User.find({}).remove(function() {});
	
var Group = require('../api/group/group.model');
Group.find({}).remove(function() {});

