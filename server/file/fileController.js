'use strict';
var config = require('config');
var Promise = require('bluebird');
var mongoClient = Promise.promisifyAll(require('mongodb').MongoClient);
var Q = require('q');
var moment = require('moment');
var _ = require('lodash');
var path = require('path');

var getProject = require('../project/getProject');
var downloadController = require('./downloadController');
// var Project = require('../models').models.Project;
var getDocumentHash = require('../file/getDocumentHash');
var backend = require('../liveDbClient');

var mongoIndex = function (str) {
  return str.replace(/\./g, '');
};

var fileController = {
  createNewFileOrFolder: function (req, res) {
    var projectName = req.body.projectName || req.param('projectName');
    var type = req.body.type || req.param('type');
    var projectId = req.body.projectId || req.param('projectId') || null;
    var filePath = req.body.filePath || req.param('filePath') || '';
    var fileInfo = {
      projectName: projectName,
      filePath: filePath,
      type: type,
      projectId: projectId,
    };
    if (type !== 'file' && type !== 'folder') {
      return res.status(400).send('Invalid File Type Specified').end();
    }
    fileController._createNewFileOrFolder(fileInfo)
      .then(function (updatedFileStructure) {
        return fileController._updateFileStructure(updatedFileStructure);
      })
      .then(function (fileStructure) {
        return res.status(201).json(fileStructure);
      })
      .catch(function (err) {
        console.log('Error Creating File or Folder:', err);
        return res.status(400).end();
      });
  },
  /**
   * Create a new file or folder and append it to the project fileStructure
   * Optionally, you can pass a fileStructure to append it to. This is intended
   * for operations in which multiple files will be written to the MongoDB.
   *
   * @param <Object> Object with all file info
   * @param <Object> (Optional) fileStructure to append changes to
   * @return <Object> fileStructure
   */
  _createNewFileOrFolder: function (fileInfo, updatefileStructure) {
    var projectName = fileInfo.projectName;
    var type = fileInfo.type;
    var projectId = fileInfo.projectId || null;
    var filePath = fileInfo.filePath;
    var userId = fileInfo.userId || null;
    return new Q()
      .then(function () {
        // Check if name is valid (no white space)
        if (!fileController._isValidFileName(filePath)) {
          throw new Error('Invalid File Name');
        }
      })
      .then(function () {
        if (updatefileStructure !== undefined) {
          return updatefileStructure;
        }
        return fileController.getFileStructure(projectId || projectName);
      })
      .catch(function () {
        console.log('Error Getting File Structure');
      })
      .then(function (fileStructure) {
        // Check if path exists
        if (!fileController._isPathValidAndFileDoesNotExistAtPath(fileStructure, filePath)) {
          throw new Error('Path is Invalid or File Already Exists');
        }
        // Create Object with author, timeCreated
        var newAddition = {
          name: path.basename(filePath),
          created: moment().format(config.get('timeFormat')),
          author: userId,
          type: type,
          path: filePath
        };
        if (type === 'folder') {
          newAddition.files = {};
        }
        return fileController._appendToFileStructure(fileStructure, filePath, newAddition);
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
              })
              .then(function (fileStructure) {
                return fileStructure;
              })
              .catch(function (err) {
                console.log('Cannot Find Collection With ID', err);
              });
          });
      });
  },
  _isValidFileName: function (filePath) {
    var fileName = path.basename(filePath);
    return !(/\s/g.test(fileName) || /\//g.test(fileName));
  },
  _appendToFileStructure: function (fileStructure, filePath, newAddition) {
    var fileDirname = path.dirname(filePath);
    var fileName = path.basename(filePath);
    if (fileDirname === '.') fileDirname = '';
    if (!fileController._isFileInFileStructre(fileStructure, filePath)) {
      var subFileStructure = fileController._getSubFileStructure(fileStructure, fileDirname);
      subFileStructure.files[mongoIndex(fileName)] = newAddition;
    }
    return fileStructure;
  },
  _getSubFileStructure: function (fileStructure, filePath) {
    var _filePath = filePath.split('/').filter(function (str) {
      return str.length > 0;
    });
    var traverseFileStructure = function (_fileStructure, filePathStructure) {
      if (filePathStructure.length === 0) {
        return _fileStructure;
      }
      if (_fileStructure.files[mongoIndex(filePathStructure[0])]) {
        var subFileStructure = _fileStructure.files[mongoIndex(filePathStructure[0])];
        return traverseFileStructure(subFileStructure, filePathStructure.splice(1));
      }
      return false;
    };
    return traverseFileStructure(fileStructure, _filePath);
  },
  /**
   * Check if a given path if valid within a fileStructure
   *
   * @param <Object> fileStructure queried from mongoDB
   * @param <String> path to be queried in fileStructure
   * @param <String> name of file
   * @return <Boolean>
   */
  _isPathValidAndFileDoesNotExistAtPath: function (fileStructure, filePath) {
    // console.log('fileStructure in _isPathValidAndFileDoesNotExistAtPath: ', fileStructure);
    // console.log('filePath in _isPathValidAndFileDoesNotExistAtPath: ', filePath);
    var fileDirname = path.dirname(filePath);
    if (fileDirname === '') return !fileController._isFileInFileStructre(fileStructure, filePath);
    if (fileDirname === '.') return !fileController._isFileInFileStructre(fileStructure, filePath);
    return !fileController._isFileInFileStructre(fileStructure, filePath);
  },
  /**
   * Returns if file is in the root of the fileStructure
   *
   * @param <Object> (fileStructure)
   * @return <Boolean>
   */
  _isFileInFileStructre: function (fileStructure, filePath) {
    var fileName = path.basename(filePath);
    var fileDirname = path.dirname(filePath);
    var subFileStructure = fileStructure;
    if (fileDirname !== '.') {
      subFileStructure = fileController._getSubFileStructure(fileStructure, fileDirname);
    }
    return _.any(subFileStructure.files, function (file) {
      return file.name === fileName;
    });
  },
  get: function (req, res) {
    var projectName = req.body.projectName;
    return fileController.getFileStructure(projectName)
      .then(function (fileStructure) {
        return res.json(fileStructure);
      });
  },
  getFileStructure: function (projectIdOrName) {
    return new Q().then(function () {
        return getProject(projectIdOrName);
      })
      .then(function (project) {
        // Get project structure form mongo
        return mongoClient.connectAsync(config.get('mongo'))
          .then(function (db) {
            var projectCollection = Promise.promisifyAll(db.collection('project_file_structre'));
            return projectCollection.findOneAsync({
                projectId: project.get('id')
              })
              .then(function (projectFileStructure) {
                // Create empty project if nothing is found
                if (projectFileStructure === null) {
                  return projectCollection.insertAsync({
                      projectId: project.get('id'),
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
    var filePaths = [];
    var getPaths = function (_fileStructure) {
      _.each(_fileStructure, function (fileOrFolder) {
        filePaths.push(fileOrFolder.path);
        if (fileOrFolder.type === 'folder') {
          getPaths(fileOrFolder.files);
        }
      });
    };
    if (!isFilesAttribute) getPaths(fileStructure.files); // default
    if (isFilesAttribute) getPaths(fileStructure);

    return filePaths;
  },

  moveFileInProject: function (req, res) {

    var fileInfo = req.body;
    var fileContent;
    var fileStructure;
    var oldPath = fileInfo.filePath;
    var newPath = fileInfo.newPath;
    var fileStructureForRes;
    /**
     * get and save file contents at the current location (before we start changing things)
     */
    downloadController._getFileContents(fileInfo.projectIdOrName, fileInfo.filePath)
      .then(function (content) {
        fileContent = content;
      })
      .catch(function (err) {
        console.log('Error moving the file: ', err);
      })
      /**
       * get and save file structure
       */
      .then(function () {
        return fileController.getFileStructure(fileInfo.projectIdOrName);
      })
      .then(function (currentFileStructure) {
        fileStructure = currentFileStructure;
        return fileController._isPathValidAndFileDoesNotExistAtPath(currentFileStructure, fileInfo.filePath);
      })
      /**
       * take the old file structure, update it, and then pass it into 'updateFileStructure' function to be saved
       */
      .then(function (validOrNot) {
        // console.log('validOrNot: ', validOrNot);
        if (validOrNot === false) {
          return fileController.moveObjectProperty(oldPath, newPath, fileStructure);
        }
        throw new Error('File Is Not Valid');
      })
      .catch(function (err) {
        console.log('Error Moving Object Property', err);
      })
      .then(function (newFileStructureToAdd) {
        return fileController._updateFileStructure(newFileStructureToAdd);
      })
      .catch(function (err) {
        console.log('Error Updating File Structure', err);
      })
      /**
       * create a new file
       */
      .then(function (newFileStructre) {
        fileStructureForRes = newFileStructre;
        var newFileInfo = {
          projectName: fileInfo.projectName,
          type: fileInfo.type,
          projectId: fileInfo.projectId,
          filePath: fileInfo.filePath,
          userId: req.user.id
        };
        return fileController._createNewFileOrFolder(fileInfo);
      })
      .catch(function (err) {
        console.log('Error Creating New File', err);
      })
      /**
       * write the file content saved at the beginning of 'moveFileInProject' with a new hash
       */
      .then(function () {
        return getDocumentHash(fileInfo.projectName, newPath);
      })
      .then(function (newHash) {
        return backend.submitAsync('documents', newHash, {
            create: {
              type: 'text',
              data: fileContent
            }
          })
          .catch(function (err) {
            console.log('Document Already Exists', err);
          });
      })
      .then(function () {
        return getDocumentHash(fileInfo.projectName, oldPath);
      })
      .then(function (oldHash) {
        return backend.submitAsync('documents', oldHash, {
          del: true
        });
      })
      .then(function (dbResponse) {
        // console.log('dbResponse: ', dbResponse);
        res.status(201).json(fileStructureForRes);
      })
      .catch(function (err) {
        console.log('Error moving file: ', err);
        res.status(400).end();
      });

  },

  saveFileStructureAndCheckIfPathIsValid: function () {

  },

  moveObjectProperty: function (oldPath, newPath, object) {
    var oldPathArray = oldPath.split('/').splice(1, oldPath.length);
    var newPathArray = newPath.split('/').splice(1, newPath.length);
    var firstBaseObject = object.files[oldPathArray[0].replace('.', '')];
    var secondBaseObject = object.files[newPathArray[0].replace('.', '')];
    var storageForFileToMove;

    var deleteProperty = function (round, urlArray, obj, index) {

      var totalRounds = oldPathArray.length - 1 || 1;

      if (totalRounds === 1 && oldPathArray.length === 1) {
        storageForFileToMove = obj;
        var tempName = oldPathArray[0].replace('.', '');
        delete object.files[tempName];
        return;
      }

      if (round === totalRounds) {

        var objKey = oldPathArray[index].replace('.', '');
        storageForFileToMove = obj.files[objKey];
        delete obj.files[objKey];
        return;
      }
      var objToPass;
      var objKey = oldPathArray[index];
      if (obj.type === 'folder') {
        var temp = obj.files;
        objToPass = temp[objKey];
      } else if (obj.type === 'file') {
        objToPass = obj[objKey];
      } else {
        console.log('Error traversing file in deleteProperty. Check if file path exists.');
      }
      deleteProperty(round + 1, urlArray, objToPass, index + 1);
    };
    deleteProperty(1, oldPathArray, firstBaseObject, 1);

    console.log('storageForFileToMove after deleting: ', storageForFileToMove);

    var addProperty = function (round, urlArray, obj, index) {
      var totalRounds = urlArray.length || 1;
      console.log('newPathArray: ', newPathArray);
      console.log('totalRounds: ', totalRounds);
      console.log('round: ', round);
      console.log('index: ', index);
      console.log('urlArray: ', urlArray);
      console.log('obj: ', obj);


      if (obj.type === 'folder') {

      }

      if (totalRounds === 1 && newPathArray.length === 1) {
        var objKey = newPathArray[0].replace('.', '');
        storageForFileToMove.path = newPath;
        obj[objKey] = storageForFileToMove;
        console.log('obj after adding: ', obj);
        return;
      }

      if (round === totalRounds) {
        var objKey = urlArray[index].replace('.', '');
        console.log('objKey', objKey);
        var nameOfFileToAdd = storageForFileToMove.name.replace('.', '');
        console.log('nameOfFileToAdd', nameOfFileToAdd);
        storageForFileToMove.path = newPath;
        obj[nameOfFileToAdd] = storageForFileToMove;
        console.log('obj after adding', obj);
        return;
      }

      var objToPass;
      var objKey = urlArray[index];
      // console.log('objKey: ', objKey);
      // console.log('obj: ', obj);
      // if (obj.type === 'folder') {
      //   // var temp = obj.files;
      //   objToPass = obj.files;
      //   console.log('objToPass: ', objToPass);
      // } else if (obj.type === 'file') {
      objToPass = obj[objKey].files;

      // } else {
      //   console.log('Error traversing file in addProperty. Check if file path exists.');
      // }
      addProperty(round + 1, urlArray, objToPass, index + 1);
    };
    addProperty(1, newPathArray, object.files, 0);

    object.paths.push(newPath);
    for (var i = 0; i < object.paths.length; i++) {
      if (object.paths[i] === oldPath) {
        object.paths.splice(i, 1);
        break;
      }
    }
    return object;
  }

};


module.exports = fileController;