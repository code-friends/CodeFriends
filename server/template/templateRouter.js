'use strict';

var express = require('express');
var templateController = require('./templateController.js');

var templateRouter = express.Router();

templateRouter.get('/', templateController.getAllTemplates);
templateRouter.post('/', templateController.createNewTemplate);
templateRouter.put('/newName', templateController.updateTemplateName);
templateRouter.put('/newGitRepoUrl', templateController.updateGitRepoUrl);
templateRouter.delete('/', templateController.deleteTemplate);

module.exports = templateRouter;