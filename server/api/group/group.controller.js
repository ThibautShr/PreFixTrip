'use strict';

var _ = require('lodash');
var Group = require('./group.model');

exports.index = function(req, res) {
  Group.find(function (err, Groups) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(Groups);
  });
};

exports.findByPseudo = function(req, res) {
  Group.find({"users.pseudo" :req.params.pseudo},function (err, Groups) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(Groups);
  });
};

exports.findByName = function(req, res) {
  Group.find({"name" :req.params.name},function (err, Groups) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(Groups);
  });
};

exports.show = function(req, res) {
  Group.findById(req.params.id, function (err, Group) {
    if(err) { return handleError(res, err); }
    if(!Group) { return res.status(404).send('Not Found'); }
    return res.json(Group);
  });
};

exports.create = function(req, res) {
  Group.create(req.body, function(err, Group) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(Group);
  });
};

exports.update = function(req, res) {
  if(req.body._id) {
	  delete req.body.id;
  }
  var p = new Group(req.body);
  Group.findOneAndUpdate(req.params.id, p, {upsert: true, new: true}, function(err, doc){
	  if(err){
		  return handleError(res, err);
	  }
	  return res.status(200).json(doc);
  });
};

exports.destroy = function(req, res) {
  Group.findById(req.params.id, function (err, Group) {
    if(err) { return handleError(res, err); }
    if(!Group) { return res.status(404).send('Not Found'); }
    Group.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}