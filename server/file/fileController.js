'use strict';
var config = require('config');
var Promise = require('bluebird');
var mongoClient = Promise.promisifyAll(require('mongodb').MongoClient);
var Q = require('q');
var moment = require('moment');
var _ = require('lodash');
var ProjectCollection = require('../models').collections.ProjectCollection;
var downloadController = require('./downloadController');
// var Project = require('../models').models.Project;

var mongoIndex = function (str) {
  return str.replace('.', '');
};

var fileController = {
  createNewFileOrFolder: function (req, res) {
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
        return res.status(201).json(fileStructure);
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
    var fileContents = fileInfo.fileContents || null;
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
          throw new Error('Path is Invalid or File Already Exists');
        }
        // Create Object with author, timeCreated
        var newAddition = {
          name: fileName,
          created: moment().format(config.get('timeFormat')),
          author: userId,
          type: type,
          path: path + '/' + fileName
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
    if (path === '.') path = '';
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
    if (path === '.') return !fileController._isFileInFileStructre(fileStructure, fileName);
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
                projectFileStructure.paths = fileController.getPathsForFileStructure(projectFileStructure);
                return projectFileStructure;
              });
          })
          .catch(function (error) {
            console.log('Error Connecting to MongoDB', error);
          });
      });
  },
  getPathsForFileStructure: function (fileStructure, isFilesAttribute) {
    isFilesAttribute = isFilesAttribute || false;
    var paths = [];
    var getPaths = function (_fileStructure) {
      _.each(_fileStructure, function (fileOrFolder) {
        paths.push(fileOrFolder.path);
        if (fileOrFolder.type === 'folder') {
          getPaths(fileOrFolder.files);
        }
      });
    };
    if (!isFilesAttribute) getPaths(fileStructure.files); // default
    if (isFilesAttribute) getPaths(fileStructure);
    return paths;
  },
  moveFileInProject: function (req, res) {
    console.log('hello!!!!');
    var fileInfo = req.body;
    var fileContent;
    var isItValidUrl;
    var fileStructure;
    // console.log('fileInfo: ', fileInfo);
    downloadController._getFileContents(fileInfo.projectIdOrName, fileInfo.path);
    // .then(function (content) {
    //     console.log('-------------------------');
    //     console.log('content : ', content);
    //     console.log('-------------------------');
    //     // fileContent = content;
    //     // console.log('fileContent: ', fileContent);
    //   })
    //   .catch(function (err) {
    //     console.log('Error moving the file: ', err);
    //   });
  }

  //   return fileController.getFileStructure(fileInfo.projectIdOrName)
  //     .then(function (currentFileStructure) {
  //       fileStructure = currentFileStructure;
  //       return fileController._isPathValid(fileStructure, fileInfo.path)
  //         .then(function (validOrNot) {
  //           isItValidUrl = validOrNot;
  //         });
  //     })
  //     .then(function (fileStructure) {
  //       console.log('fileStructure: ', fileStructure);
  //       console.log('fileContent: ', fileContent);

  //       return fileController.moveObjectProperty(fileInfo.oldUrl, fileInfo.newUrl, fileStructure);
  //     });
  // }
  //     .then(function (newFileStructureToAdd) {
  //       return fileController._updateFileStructure(newFileStructureToAdd); //may not need return
  //     })
  //     .then(function () {
  //       return getDocumentHash(projectName, documentName)
  //         .then(function (documentHash) {
  //           backend.submitAsync('documents', documentHash, {
  //               create: {
  //                 type: 'text',
  //                 data: fileContent
  //               }
  //             })
  //             .catch(function (err) {
  //               console.log('Document Already Exists', err);
  //             })
  //             .then(function () { // err, version, transformedByOps, snapshot
  //               var fileInfo = {
  //                 projectName: projectName,
  //                 fileName: documentName,
  //                 type: type,
  //                 path: '',
  //                 userId: userId
  //               };
  //               fileController._createNewFileOrFolder(fileInfo)
  //                 .then(function (newFileStructre) {
  //                   res.json(newFileStructre);
  //                 })
  //                 .catch(function (err) {
  //                   console.log('Error Creating File or Folder: ', err);
  //                   res.status(400).end();
  //                 });
  //             });
  //         })
  //         .catch(function (err) {
  //           console.log('Error uploading file', err);
  //         });
  //     })
  // },


  // moveObjectProperty: function (oldUrl, newUrl, object) {
  //   console.log('object at beginning: ', object);

  //   var oldUrlArray = oldUrl.split('/');
  //   var newUrlArray = newUrl.split('/');
  //   var baseObject = object.fileStructure.files[oldUrlArray[0]];
  //   var storageForFileToMove;

  //   var deleteProperty = function (round, urlArray, obj, index) {
  //     var totalRounds = oldUrlArray.length - 1;

  //     if (round === totalRounds) {
  //       var objKey = oldUrlArray[index];
  //       storageForFileToMove = obj.files[objKey];
  //       delete obj.files[objKey];
  //       return;
  //     }
  //     var objToPass;
  //     var objKey = oldUrlArray[index];
  //     if (obj.type === 'folder') {
  //       var temp = obj.files;
  //       objToPass = temp[objKey];
  //     } else if (obj.type === 'file') {
  //       objToPass = obj[objKey];
  //     } else {
  //       console.log('Error traversing file. Check if file path exists.');
  //     }
  //     deleteProperty(round + 1, urlArray, objToPass, index + 1);
  //   };
  //   deleteProperty(1, oldUrlArray, baseObject, 1);
  //   console.log('object after deleting property: ', object);

  //   var addProperty = function (round, urlArray, obj, index) {
  //     var totalRounds = urlArray.length - 1;

  //     if (round === totalRounds) {
  //       var objKey = urlArray[index];
  //       console.log('obj in base case of addProperty: ', obj);
  //       console.log('objKey: ', objKey);
  //       console.log('property we are adding: ', storageForFileToMove);
  //       obj.files[objKey] = storageForFileToMove;
  //       return;
  //     }

  //     var objToPass;
  //     var objKey = urlArray[index];
  //     if (obj.type === 'folder') {
  //       var temp = obj.files;
  //       objToPass = temp[objKey];
  //     } else if (obj.type === 'file') {
  //       objToPass = obj[objKey];
  //     } else {
  //       console.log('Error traversing file. Check if file path exists.');
  //     }
  //     addProperty(round + 1, urlArray, objToPass, index + 1);
  //   };
  //   addProperty(1, newUrlArray, baseObject, 1);
  //   console.log('object after adding property: ', object);

  //   return object.fileStructure;
  // }

};

module.exports = fileController;