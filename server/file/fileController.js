'use strict';
var config = require('config');
var Promise = require('bluebird');
var mongoClient = Promise.promisifyAll(require('mongodb').MongoClient);
var Q = require('q');
var moment = require('moment');
var _ = require('lodash');
var multiparty = require('multiparty');

var ProjectCollection = require('../models').collections.ProjectCollection;
// var Project = require('../models').models.Project;

var mongoIndex = function (str) {
  return str.replace('.', '');
};

var fileController = {

  createNewFileOrFolder: function (req, res) {
    console.log('req: ', req);
    var projectName = req.body.project_name || req.param('project_name');
    var fileName = req.body.file_name || req.param('file_name');
    var type = req.body.type || req.param('type');
    var projectId = req.body.project_id || req.param('project_id') || null;
    var path = req.body.path || req.param('path') || '';
    var fileInfo = {
      projectName: projectName,
      fileName: fileName,
      type: type,
      projectId: projectId,
      path: path
    };

    if (type !== 'file' && type !== 'folder') {
      return res.status(400).send('Invalid File Type Specified').end();
    }
    fileController._createNewFileOrFolder(fileInfo)
      .then(function (fileStructure) {
        return res.json(fileStructure);
      })
      .catch(function (err) {
        return res.status(400).send(err.toString()).end();
      });
  },
  _createNewFileOrFolder: function (fileInfo) {

    var projectName = fileInfo.projectName;
    var fileName = fileInfo.fileName;
    var type = fileInfo.type;
    var projectId = fileInfo.projectId || null;
    var path = fileInfo.path;
    var userId = fileInfo.userId || null;

    console.log('projectName: ', projectName, ', fileName: ', fileName, ', projectId: ', projectId, ', type: ', type, ', path: ', path, 'userId: ', userId);

    return new Q()
      .then(function () {
        // Check if name is valid (no white space)
        if (!fileController._isValidFileName(fileName)) {
          throw new Error('Invalid File Name');
        }
      })
      .then(function () {
        return fileController.getFileStructure(projectId, projectName);
      })
      .then(function (fileStructure) {
        // Check if path exists
        if (!fileController._isPathValid(fileStructure, path, fileName)) {
          throw new Error('File Already Exists');
        }
        // Create Object with author, timeCreated
        var newAddition = {
          name: fileName,
          created: moment().format(config.get('timeFormat')),
          author: userId,
          type: type
        };
        if (type === 'folder') {
          newAddition.files = {};
        }
        var updatedFileStructure = fileController._appendToFileStructure(fileStructure, path, fileName, newAddition);
        // Update file structure for whole project in mongo
        return fileController._updateFileStructure(updatedFileStructure);
      });
  },
  /**
   * Updated fileStructure in Mongo Database
   *
   * @param <Object> fileStructure
   * @return <Promise>
   */
  _updateFileStructure: function (fileStructure) {
    return mongoClient.connectAsync(config.get('mongo'))
      .then(function (db) {
        return Promise.promisifyAll(db.collection('project_file_structre'));
      })
      .then(function (projectCollection) {
        return projectCollection.updateAsync({
            _id: fileStructure._id
          }, {
            $set: {
              files: fileStructure.files
            }
          }, {
            w: 1
          })
          .then(function () {
            return projectCollection.findOneAsync({
              _id: fileStructure._id
            });
          });
      });
  },
  _isValidFileName: function (fileName) {
    return !(/\s/g.test(fileName) || /\//g.test(fileName));
  },
  _appendToFileStructure: function (fileStructure, path, fileName, newAddition) {
    fileController._getSubFileStructure(fileStructure, path, function (subFileStructure) {
      if (!fileController._isFileInFileStructre(subFileStructure)) {
        subFileStructure.files[mongoIndex(fileName)] = newAddition;
      }
    });
    return fileStructure;
  },
  _getSubFileStructure: function (fileStructure, path, cb) {
    var _path = path.split('/').filter(function (str) {
      return str.length > 0;
    });
    var traverseFileStructure = function (_fileStructure, pathStructure) {
      if (pathStructure.length === 0) {
        cb(_fileStructure);
        return true;
      }
      if (_fileStructure.files[mongoIndex(pathStructure[0])]) {
        var subFileStructure = _fileStructure.files[mongoIndex(pathStructure[0])];
        return traverseFileStructure(subFileStructure, pathStructure.splice(1));
      }
      return false;
    };
    return traverseFileStructure(fileStructure, _path);
  },
  /**
   * Check if a given path if valid within a fileStructure
   *
   * @param <Object> fileStructrue queried from mongoDB
   * @param <String> path to be queried in fileStructure
   * @param <String> name of file
   * @return <Boolean>
   */
  _isPathValid: function (fileStructure, path, fileName) {
    if (path === '') return !fileController._isFileInFileStructre(fileStructure, fileName);
    var isValidPath = false;
    fileController._getSubFileStructure(fileStructure, path, function (subFileStructure) {
      if (!fileController._isFileInFileStructre(subFileStructure, fileName)) {
        isValidPath = true;
      }
    });
    return isValidPath;
  },
  _isFileInFileStructre: function (fileStructure, fileName) {
    return _.any(fileStructure.files, function (file) {
      return file.name === fileName;
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
        return mongoClient.connectAsync(config.get('mongo'))
          .then(function (db) {
            var projectCollection = Promise.promisifyAll(db.collection('project_file_structre'));
            return projectCollection.findOneAsync({
                project_id: project.get('id')
              })
              .then(function (projectFileStructure) {
                // Create empty project if nothing is found
                if (projectFileStructure === null) {
                  return projectCollection.insertAsync({
                      project_id: project.get('id'),
                      files: {}
                    })
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