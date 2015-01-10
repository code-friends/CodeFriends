/*jshint node:true */
'use strict';
var backend = require('../liveDbClient');
var getDocumentHash = require('../file/getDocumentHash');
var _ = require('lodash');

var downloadController = {
  downloadFile: function (req, res) {
    var parsedUrl = req.params[0].split('/');
    var projectName = parsedUrl[1];
    var filePath = parsedUrl[3];
    return downloadController._getFileContents(projectName, filePath)
      .then(function (fileContents) {
        var fileName = downloadController._getFileNameFromPath(filePath);
        res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
        res.send(fileContents);
      })
      .catch(function (err) {
        console.log('Error downloading file: ', err);
      });
  },
  _getFileContents: function (projectNameOrId, filePath) {
    // console.log('projectNameOrId: ', projectNameOrId);
    // console.log('filePath: ', filePath);
    if (!projectNameOrId) throw new Error('No Project Specified');
    if (typeof filePath !== 'string') throw new Error('No Document Path Specified');
    return getDocumentHash(projectNameOrId, filePath)
      .then(function (documentHash) {
        return backend.fetchAsync('documents', documentHash)
          .then(function (file) {
            // If the file is empty or not found, create an empty file
            if (file.data === undefined) {
              return backend.submitAsync('documents', documentHash, {
                  create: {
                    type: 'text',
                    data: ''
                  }
                })
                .catch(function (err) {
                  console.log('LiveDB (_getFileContents) Document Already Exists', err);
                })
                .then(function () {
                  return ''; // This document is empty
                });
            }
            return file.data;
          });
      })
      .then(function (fileContents) {
        // console.log('filePath: ', filePath);
        return fileContents;
      })
      .catch(function (err) {
        console.log('Error Fetching Document', err);
      });
  },
  _getFileNameFromPath: function (path) {
    return _.last(path.split('/'));
  }
};

module.exports = downloadController;