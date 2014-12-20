var express = require('express');
var userModel = require('./userModel.js');
var models = require('../models.js').models;
var collections = require('../models.js').collections;

var userController = {};

userController.post = function (req, res) {
	res.status(200).end();
};

userController.getAllUsers = function (req, res) {
	console.log('got into getAllUsers');
	models.User
		.fetchAll({
			withRelated: ['project']
		})
		.then(function (coll) {
			res.json(coll.toJSON()).end();
		})
};

userController.getSpecificUser = function (req, res) {
	console.log('got into getSpecificUser');
	models.User
		.query('where', 'id', '=', req.params.id)
		.fetch({
			withRelated: ['project']
		})
		.then(function (coll) {
			// console.log('RES !!!!!!!!!!!', res);
			// console.log('COLl !!!!!!!!!!!!!!!!!!!!!', coll);
			res.send(coll);
		})
};


userController.put = function (req, res) {
	res.status(200).end();
};

userController.delete = function (req, res) {
	res.status(200).end();
};

module.exports = userController;