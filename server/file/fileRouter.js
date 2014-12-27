var express = require('express');
var fileController = require('./fileController');

var fileRouter = express.Router();

fileRouter.post('/', fileController.createNewFile);

module.exports = fileRouter;