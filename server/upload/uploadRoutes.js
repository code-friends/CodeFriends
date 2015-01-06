'use strict';

var express = require('express');
var uploadController = require('./uploadController.js');

var uploadRouter = express.Router();

uploadRouter.post('/', uploadController.uploadNewFile);

module.exports = uploadRouter;