'use strict';

var express = require('express');
var controller = require('./bill.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/:_id', controller.show);
router.get('/user/:_id', controller.indexId);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:_id', auth.isAuthenticated(), controller.update);
router.patch('/:_id', auth.isAuthenticated(), controller.update);
router.delete('/:_id', auth.isAuthenticated(), controller.destroy);

module.exports = router;