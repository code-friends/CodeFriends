'use strict';

var express = require('express');
var downloadController = require('./downloadController.js');

var downloadRouter = express.Router();

downloadRouter.get('/projectId:?/fileName:?', downloadController.downloadFile);

module.exports = downloadRouter;