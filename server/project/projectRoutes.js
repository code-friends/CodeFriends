var express = require('express');
var projectController = require('./projectController.js');

var projectRouter = express.Router();

console.log('got to projectRouter');
projectRouter.post('/', projectController.post);
projectRouter.get('/', projectController.getAllProjects);
projectRouter.get('/:id', projectController.getSpecificProject);
projectRouter.put('/', projectController.put);
projectRouter.delete('/', projectController.delete);

module.exports = projectRouter;