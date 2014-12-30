'use strict';
var Promise = require('bluebird');
var mongoClient =  Promise.promisifyAll(require('mongodb').MongoClient);
var Q = require('q');
var moment = require('moment');

var ProjectCollection = require('../models').collections.ProjectCollection;
// var Project = require('../models').models.Project;

var fileController = {
  createNewFile: function (req, res) {
    var userId = req.user.get('id');
    var projectName = req.body.project_name || req.param('project_name');
    var fileName = req.body.file_name || req.param('file_name');
    var projectId = req.body.project_id || req.param('project_id') || null;
    // path: req.body.path || req.param('path') || ''

    // Check if name is valid (no white space)
    if (/\s/g.test(fileName)) {
      return res.status(400).send('Invalid File Name').end();
    }
    return fileController.getFileStructure(projectId, projectName)
      .then(function (fileStructure) {
        // TODO: If path is not empty
          // Check if path exists
        return mongoClient.connectAsync('mongodb://localhost:27017/codeFriends?auto_reconnect')
          .then(function (db) {
            var projectCollection = Promise.promisifyAll(db.collection('project_file_structre'));
            // Create Object with author, timeCreated
            var files = fileStructure.files;
            if (fileStructure.files[fileName] === undefined) {
              var mysqlFormat = 'YYYY-MM-DD HH:MM:SS';
              files[fileName.replace('.', '')] = {
                name: fileName,
                created: moment().format(mysqlFormat),
                author: req.user.get('id')
              };
              // Update file structure for whole project in mongo
              return projectCollection.updateAsync({_id: fileStructure._id }, {$set: {files: files}}, {w: 1})
                .then(function () {
                  return projectCollection.findOneAsync({_id: fileStructure._id});
                });
            }
            return fileStructure;
          })
          .then(function (fileStructure) {
            return res.json(fileStructure).end();
          });
      })
      .catch(function (error) {
        console.log('Error:', error);
        res.status(400).end();
      });
  },
  get: function (req, res) {
    var project_name = req.body.project_name;
    return fileController.getFileStructure(null, project_name)
      .then(function (fileStructure) {
        return res.json(fileStructure);
      });
  },
  getFileStructure: function (projectId, projectName) {
    return new Q().then(function () {
      if (projectId !== null && projectId !== undefined) { // If project ID
        // Check if project ID exists
        return ProjectCollection
          .query('where', 'id', '=', projectId)
          .fetchOne();
      }
      // If project name
      if (projectName !== null && projectName !== undefined) {
        // Get project ID
        return ProjectCollection
          .query('where', 'project_name', '=', projectName)
          .fetchOne();
      }
      throw new Error('No Project ID or name specified');
    })
    .then(function (project) {
      // Get project structure form mongo
      return mongoClient.connectAsync('mongodb://localhost:27017/codeFriends?auto_reconnect')
        .then(function (db) {
          var projectCollection = Promise.promisifyAll(db.collection('project_file_structre'));
          return projectCollection.findOneAsync({project_id: project.get('id')})
            .then(function (projectFileStructure) {
              // Create empty project if nothing is found
              if (projectFileStructure === null) {
                return projectCollection.insertAsync({project_id: project.get('id'), files: {}})
                  .then(function (projectFileStructure) {
                    return projectFileStructure[0];
                  });
              }
              return projectFileStructure;
            })
            .then(function (projectFileStructure) {
              db.close();
              return projectFileStructure;
            });
        })
        .catch(function (error) {
          console.log('Error Connecting to MongoDB', error);
        });
    });
  }
};

module.exports = fileController;