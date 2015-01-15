'use strict';

var express = require('express');
var projectController = require('./projectController.js');

var projectRouter = express.Router();

projectRouter.post('/', projectController.post);
projectRouter.get('/', projectController.getAllProjects);
projectRouter.get('/download/:projectNameOrId', projectController.downloadSpecificProject);
projectRouter.get('/:projectNameOrId', projectController.getSpecificProject);
projectRouter.put('/addUser', projectController.addUser);
// projectRouter.post('/add', projectController.addToRepository);
// projectRouter.post('/commit', projectController.commitToRepository);
projectRouter.delete('/:projectNameOrId', projectController.delete);

module.exports = projectRouter;