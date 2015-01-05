'use strict';
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');
var mongoClient = Promise.promisifyAll(require('mongodb').MongoClient);
var Q = require('q');
var moment = require('moment');
var Hashes = require('jshashes');
var multiparty = require('multiparty');
var backend = require('../liveDbClient');
var fileController = require('../file/fileController');

var uploadController = {
  uploadNewFile: function (req, res) {

    var size = '';
    var projectName;
    var documentName;
    var fileContent;
    var userId = req.user.get('id');
    var destination_path = '';
    var form = new multiparty.Form();

    //upload file to mongo
    form.on('error', function (err) {
      console.log('Error parsing form: ' + err.stack);
    });

    form.on('part', function (part) {
      if (!part.filename) {
        return;
      }
      size = part.byteCount;
      var file_name = part.filename;
    });

    form.on('file', function (name, file) {
      var temportal_path = file.path;
      fs.readFile(temportal_path, function (err, data) {
        if (err) throw err;
        fileContent = data.toString();
        // console.log(fileContent);

        var str = 'p-' + projectName + '-d' + documentName;
        var documentHash = new Hashes.SHA256().hex(str);
        // console.log('fileContent:', fileContent);
        // console.log(documentHash);
        backend.submit('documents', documentHash, {
            create: {
              type: 'text',
              data: fileContent
            }
          },
          function (err, version, transformedByOps, snapshot) {
            if (err) {
              console.log('ERROR: ', err);
            }
            console.log('version: ', version);
            console.log('transformedByOps: ', transformedByOps);
            console.log('snapshot: ', snapshot);
            var fileInfo = {
              projectName: projectName,
              fileName: documentName,
              type: 'file', ///need to make flexible to take folders too
              path: '',
              userId: userId
            };
            fileController._createNewFileOrFolder(fileInfo)
              .then(function (newFileStructre) {
                console.log('newFileStructre');
                console.log(newFileStructre);
              })
              .catch(function (err) {
                console.log('Error Creating File or Folder: ', err);
              });
          });
      });
    });

    form.on('close', function () {
      console.log('Uploaded!!');
    });

    form.parse(req, function (err, fields, file) {
      if (err) {
        console.log('err: ', err);
      }
      projectName = fields.project_name[0];
      documentName = fields.file_name[0];
    });

    //update file structure

  }
};

module.exports = uploadController;