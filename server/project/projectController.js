/*jshint node:true, nonew:true */
'use strict';
var Promise = require('bluebird');
var db = require('../db');
var _ = require('lodash');
var Q = require('q');
var multiparty = Promise.promisifyAll(require('multiparty'));

// Models
var models = require('../models.js').models;
// File Controller
var getFileStructure = require('../file/fileController').getFileStructure;
var getPathsForFileStructure = require('../file/fileController').getPathsForFileStructure;
var addAllFilesInZipToProject = require('../file/uploadController')._addAllFilesInZipToProject;
// Utility Functions
var getProject = require('./getProject');
var getUser = require('./getUser');
var getProjectZip = require('./getProjectZip');

var projectController = {};

/**
 * Post a new Project
 * Adds a new project and adds a the creator to the 'user' property
 */
projectController.post = function (req, res) {
  // Define the handler to be used by multipart form and application/json request
  var postRequestHandler = function (projectName) {
    return new Q()
      .then(function () {
        if (!projectName) throw new Error('No Project Name Passed');
        if (!req.user) throw new Error('No User Name Passed');
      })
      .then(function () {
        return new models.Project({
            project_name: projectName,
          })
          .save()
          .then(function (model) {
            return model
              .related('user')
              .create(req.user)
              .yield(model);
          });
      });
  };

  var getFieldProperty = function (fields, propertyName) {
    return _.flatten(_.compact(_.pluck(fields, propertyName)))[0];
  };

  var contentTypeIsMultipart = req.get('Content-Type').indexOf('multipart/form-data') !== -1;
  return new Q()
    .then(function () {
      // If it's a multipart form
      if (contentTypeIsMultipart) {
        var form = new multiparty.Form();
        return form.parseAsync(req)
          .then(function (fields) {
            fields = _.flatten(fields);
            var projectName = getFieldProperty(fields, 'project_name') || req.body.project_name;
            var projectFile = getFieldProperty(fields, 'project_file');
            return postRequestHandler(projectName)
              .then(function (projectModel) {
                // Don't process file if it's not a .zip
                if (projectFile.headers['content-type'] !== 'application/zip') return projectModel;
                // Upload .zip
                return addAllFilesInZipToProject(projectModel, req.user.get('id'), projectFile.path);
              });
          });
      }
      // If it's a json!
      return postRequestHandler(req.body.project_name);
    })
    .then(function (model) {
      res.status(201).json(model.toJSON());
    })
    .catch(function (err) {
      console.log('Error Creating Project', err);
      res.status(400).end();
    });
};

/**
 * Get all projects by req.user
 */
projectController.getAllProjects = function (req, res) {
  //the below request is not optimized
  models.Project
    .fetchAll({
      withRelated: ['user']
    })
    .then(function (coll) {
      return coll.toJSON().filter(function (model) {
        return _.some(model.user, function (user) {
          return user.id === req.user.get('id');
        });
      });
    })
    .then(function (projectsArray) {
      res.json(projectsArray);
    })
    .catch(function (err) {
      console.log('Error fetching projects : ', err);
    });
};

/**
 * Get a specific project
 */
projectController.getSpecificProject = function (req, res) {
  //only get the requested project if the user has a relation with it
  return getProject(req.params.project_name_or_id)
    .then(function (project) {
      return getFileStructure(project.get('id'))
        .then(function (fileStructure) {
          var project_json = project.toJSON();
          project_json.files = fileStructure.files;
          project_json.paths = getPathsForFileStructure(fileStructure.files);
          res.json(project_json);
        });
    })
    .catch(function (err) {
      console.log('Could Not Get getSpecificProject', err);
    });
};

/**
 * Add a user to a project
 *
 * @param project_name <String>
 * @param newUserName <String>
 */
projectController.addUser = function (req, res) {
  var project_name = req.body.project_name;
  var newUserName = req.body.newUserName;
  //only only add the user if the person that requested the addition is a listed user of the project
  return getUser(newUserName)
    .then(function (user) {
      if (!user) throw new Error('There is not model with this name');
      // Change so that if there is not user, it does a res.end saying 'there is no user'
      // so they know that on the front end
      return user;
    })
    .then(function (queriedUser) {
      return getProject(project_name)
        .then(function (model) {
          return model
            .related('user')
            .create({
              id: queriedUser.get('id')
            })
            .yield(model)
            .then(function (model) {
              res.json(model.toJSON());
            })
            .catch(function (err) {
              console.log('Error adding user', err);
            });
        });

    })
    .catch(function (err) {
      console.log('Error getting newUserId', err);
    });
};

/**
 * Delete a project
 *
 * @param id <Integer>
 */
projectController.delete = function (req, res) {
  //only delete the project if person requesting the deletion has a relation with it
  return getProject(req.body.id)
    .then(function (model) {
      if (model === null) {
        throw new Error('No model found for that id');
      }
      return db('projects_users')
        .where('project_id', '=', model.get('id'))
        .del()
        .then(function () {
          return model;
        });
    })
    .then(function (model) {
      return model.destroy();
    })
    .then(function () {
      res.status(200).end();
    })
    .catch(function () {
      res.status(400).end();
    });
};

/**
 * Download a project as a .zip
 */
projectController.downloadSpecificProject = function (req, res) {
  return getProjectZip(req.params.project_name_or_id)
    .then(function (zipObject) {
      res.setHeader('Content-disposition', 'attachment; filename=' + zipObject.name + '.zip');
      res.setHeader('content-type', 'application/zip');
      res.sendFile(zipObject.path);
    })
    .catch(function (err) {
      console.log('Error Getting Project Zip', err);
      res.status(400).send(err);
    });
};

module.exports = projectController;