var userModel = require('./userModel.js');
var express = require('express');
var models = require('../models.js').models;
var collections = require('../models.js').collections;

var userController = {};

userController.post = function (req, res) {
	res.status(200).end();
};

userController.get = function (req, res) {
	res.status(200).end();
};

userController.put = function (req, res) {
	res.status(200).end();
};

userController.delete = function (req, res) {
	res.status(200).end();
};

module.exports = userController;