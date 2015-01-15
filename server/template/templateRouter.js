'use strict';

var express = require('express');
var templateController = require('./templateController.js');

var templateRouter = express.Router();

templateRouter.post('/', templateController.createNewTemplate);

module.exports = templateRouter;