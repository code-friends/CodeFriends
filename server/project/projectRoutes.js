var express = require('express');
var projectController = require('./projectController.js');

var projectRouter = express.Router();

projectRouter.post('/', projectController.post);
projectRouter.get('/', projectController.getAllProjects);
projectRouter.get('/projectname:project_name', projectController.getSpecificProjectByName);
projectRouter.get('/id/:id', projectController.getSpecificProjectById);
projectRouter.put('/addUser/', projectController.addUser);
projectRouter.put('/', projectController.put);
projectRouter.delete('/', projectController.delete);

module.exports = projectRouter;