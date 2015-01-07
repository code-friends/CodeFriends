'use strict';
var Promise = require('bluebird');
var db = require('../db');
var _ = require('lodash');
var Q = require('q');

var models = require('../models.js').models;
var getFileContents = require('../download/downloadController')._getFileContents;
var getFileStructure = require('../file/fileController').getFileStructure;
var getPathsForFileStructure = require('../file/fileController').getPathsForFileStructure;
var JSZip = require("jszip");

var projectController = {};

/**
 * Post a new Project
 * Adds a new project and adds a the creator to the 'user' property
 */
projectController.post = function (req, res) {
  var project_name = req.body.project_name;
  if (!project_name || !req.user) {
    res.status(400).end();
  }
  new models.Project({
      project_name: project_name,
    })
    .save()
    .then(function (model) {
      return model
        .related('user')
        .create(req.user)
        .yield(model)
        .catch(function (err) {
          console.log('Error Attaching User:', err);
        });
    })
    .then(function (model) {
      res.json(model.toJSON());
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
  models.Project
    .query({
      where: {
        project_name: req.params.project_name_or_id
      },
      orWhere: {
        id: req.params.project_name_or_id
      }
    })
    .fetch({
      withRelated: ['user']
    })
    .then(function (project) {
      return getFileStructure(project.get('id'))
        .then(function (fileStructure) {
          var project_json = project.toJSON();
          project_json.files = fileStructure.files;
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
  models.User
    .query({
      where: {
        username: newUserName
      }
    })
    .fetch({
      withRelated: ['project']
    })
    .then(function (user) {
      if (!user) throw new Error('There is not model with this name');
      // Change so that if there is not user, it does a res.end saying 'there is no user'
      // so they know that on the front end
      return user;
    })
    .then(function (queriedUser) {
      return models.Project
        .query({
          where: {
            project_name: project_name
          }
        })
        .fetch({
          withRelated: ['user']
        })
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
  models.Project
    .query({
      where: {
        id: req.body.id
      }
    })
    .fetch()
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
  var project;
   return models.Project
    .query({
      where: {
        project_name: req.params.project_name_or_id
      },
      orWhere: {
        id: req.params.project_name_or_id
      }
    })
    .fetch()
    .then(function (_project) {
      project = _project;
      if (!project) throw new Error('No Model Could Be Found');
      return getFileStructure(project.get('id'), project.get('project_name'))
         .then(function (fileStructure) {
          var paths = getPathsForFileStructure(fileStructure);
          return Q.allSettled(paths.map(function (path) {
            return getFileContents(project, path)
              .then(function (fileContents) {
                return {
                  path: path,
                  fileContents: fileContents
                };
              });
          }));
        });
    })
    .then(function (allFileContents){
      var projectArchive = new JSZip();
      allFileContents.forEach(function (file) {
        var filePath = file.value.path;
        var fileContents = file.value.fileContents;
        projectArchive.file(filePath, fileContents);
      });
      var content = null;
      if (JSZip.support.uint8array) {
        content = projectArchive.generate({type : 'uint8array'});
      } else {
        content = projectArchive.generate({type : 'string'});
      }
      res.setHeader('Content-disposition', 'attachment; filename=' + project.get('project_name'));
      res.setHeader('content-type', 'application/zip');
      res.send(content);
    })
    .catch(function (err) {
      console.log('ERROR', err);
      res.status(400).send(err);
    });
};

module.exports = projectController;