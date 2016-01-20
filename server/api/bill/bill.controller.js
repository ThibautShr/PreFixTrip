// JavaScript Document'use strict';

var _ = require('lodash');
var Bill = require('./bill.model');

exports.index = function(req, res) {
  Bill.find(function (err, Bills) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(Bills);
  });
};

exports.indexId = function(req, res) {
  Bill.find({"bill._id" :req.params._id},function (err, Bills) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(Bills);
  });
};

exports.show = function(req, res) {
  Bill.findById(req.params.id, function (err, Bill) {
    if(err) { return handleError(res, err); }
    if(!Bill) { return res.status(404).send('Not Found'); }
    return res.json(Bill);
  });
};

exports.create = function(req, res) {
  Bill.create(req.body, function(err, Bill) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(Bill);
  });
};

exports.update = function(req, res) {
  if(req.body._id) {
	  delete req.body.id;
  }
  var p = new Bill(req.body);
  Bill.findOneAndUpdate(req.params.id, p, {upsert: true, new: true}, function(err, doc){
	  if(err){
		  return handleError(res, err);
	  }
	  return res.status(200).json(doc);
  });
};

exports.destroy = function(req, res) {
  Bill.findById(req.params.id, function (err, Bill) {
    if(err) { return handleError(res, err); }
    if(!Bill) { return res.status(404).send('Not Found'); }
    Bill.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}