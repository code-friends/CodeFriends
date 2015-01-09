'use strict';
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var multiparty = require('multiparty');
var backend = require('../liveDbClient');
var fileController = require('../file/fileController');
var getDocumentHash = require('../file/getDocumentHash');

var uploadController = {
  uploadNewFile: function (req, res) {
    var size = '';
    var projectName;
    var documentName;
    var fileContent;
    var userId = req.user.get('id');
    var form = new multiparty.Form();
    // Upload file to mongo
    form.on('error', function (err) {
      console.log('Error parsing form: ' + err.stack);
    });
    form.on('part', function (part) {
      if (!part.filename) {
        return;
      }
      size = part.byteCount;
    });
    form.on('file', function (name, file) {
      var temportal_path = file.path;
      fs.readFile(temportal_path, function (err, data) {
        if (err) throw err;
        fileContent = data.toString();
        /**
         * This currently doesn't support paths (it should)
         * Remove the '/' in that string and replace it with proper paths
         */
        return getDocumentHash(projectName, documentName)
          .then(function (documentHash) {
            backend.submitAsync('documents', documentHash, {
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
                  userId: userId
                };
                fileController._createNewFileOrFolder(fileInfo)
                  .then(function (newFileStructre) {
                    res.status(201).json(newFileStructre);
                  })
                  .catch(function (err) {
                    console.log('Error Creating File or Folder: ', err);
                    res.status(400).end();
                  });
              });
          })
          .catch(function (err) {
            console.log('Error uploading file', err);
          });
        });
    });
    form.parse(req, function (err, fields, file) {
      if (err) {
        console.log('err: ', err);
      }
      projectName = fields.project_name[0] || req.body.project_name;
      documentName = fields.file_name[0] || file.originalFilename;
    });
  }
};

module.exports = uploadController;