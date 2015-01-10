/*jshint node:true */
'use strict';
var backend = require('../liveDbClient');
var getDocumentHash = require('../file/getDocumentHash');
var _ = require('lodash');

var downloadController = {
  downloadFile: function (req, res) {
    var parsedUrl = req.params[0].split('/');
    var projectName = parsedUrl[1];
    var documentPath = parsedUrl[3];
    return downloadController._getFileContents(projectName, documentPath)
      .then(function (fileContents) {
        var fileName = downloadController._getFileNameFromPath(documentPath);
        res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
        res.send(fileContents);
      })
      .catch(function (err) {
        console.log('Error downloading file: ', err);
      });
  },
  _getFileContents: function (projectNameOrId, documentPath) {
    // console.log('projectNameOrId: ', projectNameOrId);
    // console.log('documentPath: ', documentPath);
    if (!projectNameOrId) throw new Error('No Project Specified');
    if (typeof documentPath !== 'string') throw new Error('No Document Path Specified');
    return getDocumentHash(projectNameOrId, documentPath)
      .then(function (documentHash) {
        console.log('GET FILE CONTESTS projectNameOrId: ', projectNameOrId);
        console.log('GET FILE CONTESTS documentPath: ', documentPath);
        console.log('GET FILE CONTESTS documentHash: ', documentHash);
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
        // console.log('documentPath: ', documentPath);
        console.log('fileContents: ', fileContents);
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