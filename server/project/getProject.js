'use strict';

var models = require('../models.js').models;

var getProject = function (projectNameOrId) {
  return models.Project
    .query({
      where: {
        project_name: projectNameOrId
      },
      orWhere: {
        id: projectNameOrId
      }
    })
    .fetch({
      withRelated: ['user']
    })
    .then(function (project) {
      if (!project) throw new Error('No Model Could Be Found');
      return project;
    });
};

module.exports = getProject;