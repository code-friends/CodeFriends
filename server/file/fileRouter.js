'use strict';

var express = require('express');
var fileController = require('./fileController');
var uploadController = require('./uploadController.js');
var downloadController = require('./downloadController.js');

var fileRouter = express.Router();

fileRouter.post('/', fileController.createNewFileOrFolder);
fileRouter.get('/', fileController.get);
fileRouter.post('/upload/', uploadController.uploadNewFile);
fileRouter.get('/download/*', downloadController.downloadFile);
fileRouter.put('/move', fileController.moveFileInProject);

module.exports = fileRouter;