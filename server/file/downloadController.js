/*jshint node:true */
'use strict';
var backend = require('../liveDbClient');
var getDocumentHash = require('../file/getDocumentHash');
var path = require('path');

var downloadController = {
  downloadFile: function (req, res) {
    var parsedUrl = req.params[0].split('/');
    var projectName = parsedUrl[1];
    var filePath = parsedUrl.slice(3).join('/');
    return downloadController._getFileContents(projectName, filePath)
      .then(function (fileContents) {
        var fileName = path.basename(filePath);
        res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
        res.send(fileContents);
      })
      .catch(function (err) {
        console.log('Error downloading file: ', err);
      });
  },

  _getFileContents: function (projectNameOrId, filePath) {
    if (!projectNameOrId) throw new Error('No Project Specified');
    if (typeof filePath !== 'string') throw new Error('No Document Path Specified');
    return getDocumentHash(projectNameOrId, filePath)
      .then(function (filePathHash) {
        return backend.fetchAsync('documents', filePathHash)
          .then(function (file) {
            // If the file is empty or not found, create an empty file
            if (file.data === undefined) {
              return backend.submitAsync('documents', filePathHash, {
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
        return fileContents;
      })
      .catch(function (err) {
        console.log('Error Fetching Document', err);
      });
  }
};

module.exports = downloadController;