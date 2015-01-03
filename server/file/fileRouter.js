'use strict';

var express = require('express');
var fileController = require('./fileController');

var fileRouter = express.Router();


fileRouter.post('/', fileController.createNewFileOrFolder);
fileRouter.get('/', fileController.get);

module.exports = fileRouter;