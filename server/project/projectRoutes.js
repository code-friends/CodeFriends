var express = require('express');
var projectController = require('./projectController.js');

var projectRouter = express.Router();

projectRouter.post('/', projectController.post);
projectRouter.get('/:id', projectController.getProject);
projectRouter.get('/', projectController.get);
projectRouter.put('/', projectController.put);
projectRouter.delete('/', projectController.delete);

module.exports = projectRouter;
