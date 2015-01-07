'use strict';

var express = require('express');
var projectController = require('./projectController.js');

var projectRouter = express.Router();

projectRouter.post('/', projectController.post);
projectRouter.get('/', projectController.getAllProjects);
projectRouter.get('/download/:project_name_or_id', projectController.downloadSpecificProject);
projectRouter.get('/:project_name_or_id', projectController.getSpecificProject);
projectRouter.put('/addUser', projectController.addUser);
projectRouter.delete('/', projectController.delete);

module.exports = projectRouter;