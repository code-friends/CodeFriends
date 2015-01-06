'use strict';

var express = require('express');
var downloadController = require('./downloadController.js');

var downloadRouter = express.Router();

downloadRouter.get('/*', downloadController.downloadFile);

module.exports = downloadRouter;