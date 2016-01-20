// JavaScript Document'use strict';

var _ = require('lodash');
var Debt = require('./debt.model');

exports.index = function(req, res) {
  Debt.find(function (err, Debts) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(Debts);
  });
};

exports.indexId = function(req, res) {
  Debt.find({"debt._id" :req.params._id},function (err, Debts) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(Debts);
  });
};

exports.show = function(req, res) {
  Debt.findById(req.params.id, function (err, Debt) {
    if(err) { return handleError(res, err); }
    if(!Debt) { return res.status(404).send('Not Found'); }
    return res.json(Debt);
  });
};

exports.create = function(req, res) {
  Debt.create(req.body, function(err, Debt) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(Debt);
  });
};

exports.update = function(req, res) {
  if(req.body._id) {
	  delete req.body.id;
  }
  var p = new Debt(req.body);
  Debt.findOneAndUpdate(req.params.id, p, {upsert: true, new: true}, function(err, doc){
	  if(err){
		  return handleError(res, err);
	  }
	  return res.status(200).json(doc);
  });
};

exports.destroy = function(req, res) {
  Debt.findById(req.params.id, function (err, Debt) {
    if(err) { return handleError(res, err); }
    if(!Debt) { return res.status(404).send('Not Found'); }
    Debt.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}