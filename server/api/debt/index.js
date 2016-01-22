'use strict';

var express = require('express');
var controller = require('./debt.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/fromUser/:user', controller.debtFromUser );
router.get('/lender/:lender', controller.lender);
router.get('/indebted/:indebted', controller.indebted);
router.get('/btw/:lender/:indebted', controller.debtBtwLenderIndebted );
router.get('/:_id', controller.show);
router.get('/search/:bill_id', controller.findByBillId);
router.post('/', controller.create);
router.put('/:_id', auth.isAuthenticated(), controller.update);
router.patch('/:_id', auth.isAuthenticated(), controller.update);
router.delete('/:_id', auth.isAuthenticated(), controller.destroy);

module.exports = router;