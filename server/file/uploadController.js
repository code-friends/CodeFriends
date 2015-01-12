'use strict';
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var multiparty = Promise.promisifyAll(require('multiparty'));
var _ = require('lodash');
var fs = Promise.promisifyAll(require('fs'));
var JSZip = require('jszip');
var path = require('path');
var Q = require('q');

var getDocumentHash = require('../file/getDocumentHash');
var backend = require('../liveDbClient');
var createNewFileOrFolder = require('./fileController')._createNewFileOrFolder;

var uploadController = {
  uploadNewFile: function (req, res) {
    var form = new multiparty.Form();
    // Upload file to mongo
    form.parseAsync(req)
      .then(function (fields) {
        var file = uploadController.getFieldProperty(fields, 'file');
        var projectName = uploadController.getFieldProperty(fields, 'projectName') || req.body.projectName;
        var filePath = uploadController.getFieldProperty(fields, 'filePath') || file.originalFilename;
        return uploadController._addFileFromFileSytemToProject(projectName, filePath, req.user.get('id'), file.path)
          .then(function (newFileStructre) {
            res.status(201).json(newFileStructre);
          })
          .catch(function (err) {
            console.log('Error Creating File or Folder: ', err);
            res.status(400).end();
          });
      })
      .catch(function (err) {
        console.log('Error Parsing Form', err);
      });
  },
  getFieldProperty: function (fields, propertyName) {
    return _.flatten(_.compact(_.pluck(fields, propertyName)))[0];
  },
  _addFileFromFileSytemToProject: function (projectName, filePath, userId, fileSystemFilePathToReadFileFrom) {
    return fs.readFileAsync(fileSystemFilePathToReadFileFrom)
      .then(function (fileBuffer) {
        var fileContent = fileBuffer.toString();
        /**
         * This currently doesn't support paths (it should)
         * Remove the '/' in that string and replace it with proper paths
         */
        return uploadController._addFileWithContentToProject(projectName, filePath, userId, fileContent);
      });
  },
  _addFileWithContentToProject: function (projectName, filePath, userId, fileContent) {
    return getDocumentHash(projectName, filePath)
      .then(function (filePathHash) {
        return backend.submitAsync('documents', filePathHash, {
            create: {
              type: 'text',
              data: fileContent
            }
          })
          .catch(function (err) {
            console.log('LiveDB (_addFileWithContentToProject) Document Already Exists', err);
          })
          .then(function () { // err, version, transformedByOps, snapshot
            var fileInfo = {
              projectName: projectName,
              filePath: filePath,
              type: 'file', ///need to make flexible to take folders too
              userId: userId
            };
            return createNewFileOrFolder(fileInfo);
          });
      })
      .catch(function (err) {
        console.log('Error uploading file', err);
      });
  },
  _addAllFilesInZipToProject: function (projectModel, userId, zipFilePathInFileSystem) {
    return fs.readFileAsync(zipFilePathInFileSystem)
      .then(function (fileContents) {
        var zip = new JSZip(fileContents);
        // Get all files in project using a regular expression
        var allFiles = zip.file(/./g);
        allFiles = allFiles.filter(function (file) {
          return !uploadController.fileShouldBeIgnored(file.name);
        });
        var allFilesAreInSameDirectory = uploadController.isEveryFileInSameDirectory(allFiles);
        if (allFilesAreInSameDirectory) {
          allFiles = uploadController.removeFirstDirectory(allFiles);
        }
        // Add all files to fileStructrue and add contents to database
        return allFiles.reduce(function (soFar, file) {
          return soFar.then(function () {
            var isFolder = (_.last(file.name) === '/');
            if (isFolder) {
              // Write file to file structure
              return createNewFileOrFolder({
                projectId: projectModel.get('id'),
                filePath: file.name,
                userId: userId,
                type: 'folder'
              });
            }
            // projectName, filePath, userId, fileContent
            return uploadController._addFileWithContentToProject(
              projectModel.get('projectName'),
              file.name,
              userId,
              file.asText()
            );
          });
        }, new Q());
      })
      .catch(function (err) {
        console.log('Error Creating Files', err);
      })
      .then(function () {
        return projectModel;
      });
  },
  fileShouldBeIgnored: function (filePath) {
    if (filePath === '') return true;
    if (path.basename(filePath).indexOf('.DS_Store') !== -1) return true;
    if (filePath.indexOf('__MACOSX') !== -1) return true;
    return false;
  },
  /**
   * Remove first directory from all files
   *
   * @param <Array> an array of object with the `name` property
   * @return <Array>
   */
  removeFirstDirectory: function (_files) {
    var files = _files.slice();
    files.filter(function (file) {
      if (file.name[0] === '/') file.name = file.name.substring(1);
      var fileParts = file.name.split('/');
      fileParts.shift();
      file.name = fileParts.join('/');
      return file;
    });
    return files;
  },
  /**
   * Determine if all files are in the same directory
   *
   * @param <Array> an array of object with the `name` property
   * @return <Boolean>
   */
  isEveryFileInSameDirectory: function (files) {
    var allTopDirectoryNames = _.map(files, function (file) {
      if (file[0] === '/') file = file.substring(1);
      return path.normalize(file.name).split('/')[0];
    });
    var uniqeDirectories = _.unique(allTopDirectoryNames);
    return uniqeDirectories.length === 1 && uniqeDirectories[0] !== undefined;

  }
};

module.exports = uploadController;