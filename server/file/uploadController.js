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
var updateFileStructure = require('./fileController')._updateFileStructure;
var getFileStructure = require('./fileController').getFileStructure;

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
            return updateFileStructure(newFileStructre);
          })
          .then(function (newFileStructre) {
            res.status(201).json(newFileStructre);
          })
          .catch(function (err) {
            console.log('Error Creating File or Folder: ', err);
            res.status(400).end();
          });
      })
      .catch(function (err) {
        throw new Error('Error Parsing Form', err);
      });
  },
  getFieldProperty: function (fields, propertyName) {
    return _.flatten(_.compact(_.pluck(fields, propertyName)))[0];
  },
  _addFileFromFileSytemToProject: function (
    projectName,
    filePath,
    userId,
    fileSystemFilePathToReadFileFrom,
    updatedFileSystem
  ) {
    return fs.lstatAsync(fileSystemFilePathToReadFileFrom)
      .then(function (fileStat) {
        if (fileStat.isDirectory()) {
          return createNewFileOrFolder({
            projectName: projectName,
            filePath: filePath,
            userId: userId,
            type: 'folder',
          }, updatedFileSystem);
        }
        if (fileStat.isFile()) {
          return fs.readFileAsync(fileSystemFilePathToReadFileFrom)
            .then(function (fileBuffer) {
              var fileContent = fileBuffer.toString();
              /**
               * This currently doesn't support paths (it should)
               * Remove the '/' in that string and replace it with proper paths
               */
              return uploadController._addFileWithContentToProject(
                  projectName, filePath, userId, fileContent, updatedFileSystem
                )
                .catch(function (err) {
                  throw new Error('Error adding file (with content) to project ' + err.message);
                });
            });
        }
      })
      .catch(function (err) {
        throw new Error('Error reading file from file system' + err.message);
      });
  },
  /**
   * Add file with Content to Project
   *
   * @param <String> Name of the project
   * @param <String> filePath with file location '/asdf/as/asdfa/hellojs'
   * @param <Number> userId
   * @param <String> fileContent
   * @param <Object> fileStructure in which to append files to
   * @return <Object> fileStructure
   */
  _addFileWithContentToProject: function (projectName, filePath, userId, fileContent, fileStructureToBeUpdated) {
    return getDocumentHash(projectName, filePath)
      .then(function (filePathHash) {
        return backend.submitAsync('documents', filePathHash, {
            create: {
              type: 'text',
              data: fileContent
            }
          })
          .catch(function (err) {
            throw new Error('LiveDB (_addFileWithContentToProject) Document Already Exists');
          })
          .then(function () { // err, version, transformedByOps, snapshot
            var fileInfo = {
              projectName: projectName,
              filePath: filePath,
              type: 'file', ///need to make flexible to take folders too
              userId: userId
            };
            return createNewFileOrFolder(fileInfo, fileStructureToBeUpdated);
          });
      });
  },
  _addAllFilesInZipToProject: function (projectModel, userId, zipFilePathInFileSystem) {
    return fs.readFileAsync(zipFilePathInFileSystem)
      .then(function (fileContents) {
        var zip = new JSZip(fileContents);
        // Get all files in project using a regular expression
        var allFiles = zip.folder(/./g).concat(zip.file(/./g));
        allFiles = uploadController.filterIgnoredFiles(allFiles);
        var allFilesAreInSameDirectory = uploadController.isEveryFileInSameDirectory(allFiles);
        if (allFilesAreInSameDirectory) {
          allFiles = uploadController.removeFirstDirectory(allFiles);
        }
        allFiles = allFiles.filter(function (v) { return !!v.name; });
        // Add all files to fileStructrue and add contents to database
        return allFiles.reduce(function (soFar, file) {
            return soFar.then(function (updatedFileStructure) {
              var isFolder = (_.last(file.name) === '/');
              if (isFolder) {
                // Write file to file structure
                return createNewFileOrFolder({
                  projectId: projectModel.get('id'),
                  filePath: file.name,
                  userId: userId,
                  type: 'folder'
                }, updatedFileStructure);
              }
              return uploadController._addFileWithContentToProject(
                projectModel.get('projectName'),
                file.name,
                userId,
                file.asText(),
                updatedFileStructure
              );
            });
          }, new Q())
          .then(function (newFileStructure) {
            return updateFileStructure(newFileStructure);
          });
      })
      .then(function () {
        return projectModel;
      });
  },
  filterIgnoredFiles: function (files) {
    if (!Array.isArray(files)) {
      throw new TypeError('`files` passed to `filterIgnoredFiles` must be an array');
    }
    return files.filter(function (file) {
      var name;
      if (typeof file === 'string') {
        name = file;
      } else {
        name = file.name;
      }
      if (name === undefined) return false;
      return !uploadController.fileShouldBeIgnored(name);
    });
  },
  fileShouldBeIgnored: function (filePath) {
    var topDirectory = path.dirname(filePath).split('/')[0];
    if (topDirectory === '.git' || path.basename(filePath) === '.git') return true;
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
