'use strict';

var express = require('express');
var templateController = require('./templateController.js');

var templateRouter = express.Router();

templateRouter.post('/', templateController.createNewTemplate);
templateRouter.put('/newName', templateController.updateTemplateName);

module.exports = templateRouter;