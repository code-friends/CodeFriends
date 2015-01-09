'use strict';
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var multiparty = Promise.promisifyAll(require('multiparty'));
var backend = require('../liveDbClient');
var fileController = require('../file/fileController');
var getDocumentHash = require('../file/getDocumentHash');
var _ = require('lodash');

var uploadController = {
  uploadNewFile: function (req, res) {
    var form = new multiparty.Form();
    // Upload file to mongo
    form.parseAsync(req)
      .then(function (fields) {
        var file = uploadController.getFieldProperty(fields, 'file');
        var projectName = uploadController.getFieldProperty(fields, 'project_name') || req.body.project_name;
        var documentName = uploadController.getFieldProperty(fields, 'file_name') || file.originalFilename;
        return uploadController._addFileFromFileSytemToProject(projectName, documentName, file.path, req.user.get('id'))
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
  _addFileFromFileSytemToProject: function (projectName, documentName, fileSystemFilePathToReadFileFrom, usedId) {
    return fs.readFileAsync(fileSystemFilePathToReadFileFrom)
      .then(function (fileBuffer) {
        var fileContent = fileBuffer.toString();
        /**
         * This currently doesn't support paths (it should)
         * Remove the '/' in that string and replace it with proper paths
         */
        return getDocumentHash(projectName, documentName)
          .then(function (documentHash) {
            return backend.submitAsync('documents', documentHash, {
                create: {
                  type: 'text',
                  data: fileContent
                }
              })
              .catch(function (err) {
                console.log('Document Already Exists', err);
              })
              .then(function () { // err, version, transformedByOps, snapshot
                 var fileInfo = {
                  projectName: projectName,
                  fileName: documentName,
                  type: 'file', ///need to make flexible to take folders too
                  path: '',
                  userId: usedId
                };
                return fileController._createNewFileOrFolder(fileInfo);
              });
          })
          .catch(function (err) {
            console.log('Error uploading file', err);
          });
      });
  }
};

module.exports = uploadController;