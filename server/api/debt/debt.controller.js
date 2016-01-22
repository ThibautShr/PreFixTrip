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


exports.lender = function(req, res) {
  Debt.find({"lender" :req.params.lender},function (err, Debts) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(Debts);
  });
};

exports.indebted = function(req, res) {
  Debt.find({"indebted" :req.params.indebted},function (err, Debts) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(Debts);
  });
};

exports.debtBtwLenderIndebted = function(req, res) {
  Debt.find({"indebted" :req.params.indebted, "lender" : req.params.lender },function (err, Debts) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(Debts);
  });
};

exports.debtFromUser = function(req, res) {
  Debt.find( { $or:[ {"lender" :req.params.user} , {"indebted" :req.params.user} ] } ,function (err, Debts) {
    if(err) { return handleError(res, err); }
	return res.status(200).json(Debts);
  });
};


exports.findByBillId = function(req, res) {
  var result = [];
  Debt.find(function (err, Debts) {
    if(err) { return handleError(res, err); }

    for(var i=0; i<Debts.length; ++i){
      for(var j=0; j<Debts[i]['list_bill_amount'].length; ++j){
        if(Debts[i]['list_bill_amount'][j] != null && Debts[i]['list_bill_amount'][j]['bill_id'] == req.params.bill_id)
          result.push(Debts[i]);
      }
    }
    return res.status(200).json(result);

  });
  /*Debt.find({list_bill_amount: { $elemMatch: { bill : req.params.bill_id }}},function (err, Debts) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(Debts);
  });*/
};

exports.show = function(req, res) {
  Debt.findById(req.params.id, function (err, Debt) {
    if(err) { return handleError(res, err); }
    if(!Debt) { return res.status(404).send('Not Found'); }
    return res.json(Debt);
  });
};

exports.create = function(req, res) {
  Debt.find({"indebted" :req.body.indebted, "lender" : req.body.lender },function (err, Debts) {
    if(Debts.length > 0){
      if(req.body._id) {
        delete req.body.id;
      }

      var p = new Object();
      p.lender = Debts[0].lender;
      p.indebted = Debts[0].indebted;
      p.amount = Debts[0].amount + req.body.amount;
      p.transactions = Debts[0].transactions;
      Debts[0].list_bill_amount.push(req.body.list_bill_amount[0]);
      p.list_bill_amount = Debts[0].list_bill_amount;

      console.log(p);

      Debt.findOneAndUpdate(Debts[0]._id, p, {upsert: true, new: true}, function(err, doc){
        if(err){
          return handleError(res, err);
        }
        return res.status(200).json(doc);
      });
    }
    else{
      Debt.create(req.body, function(err, Debt) {
      if(err) { return handleError(res, err); }
        console.log(Debt);
        return res.status(201).json(Debt);
      });
    }
  })
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