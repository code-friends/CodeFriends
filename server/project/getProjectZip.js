'use strict';
var config = require('config');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');
var JSZip = require('jszip');
var Q = require('q');

var getProject = require('./getProject');
var getFileContents = require('../file/downloadController')._getFileContents;
var getFileStructure = require('../file/fileController').getFileStructure;
var getPathsForFileStructure = require('../file/fileController').getPathsForFileStructure;

var getProjectZip = function (projectNameOrId) {
  var project;
  return getProject(projectNameOrId)
    .then(function (_project) {
      project = _project;
      return getFileStructure(project.get('id'))
         .then(function (fileStructure) {
          var paths = getPathsForFileStructure(fileStructure);
          return Q.allSettled(paths.map(function (path) {
            return getFileContents(project, path)
              .then(function (fileContents) {
                return {
                  path: path,
                  fileContents: fileContents
                };
              });
          }));
        });
    })
    .then(function (allFileContents){
      var projectArchive = new JSZip();
      var projectName = project.get('projectName');
      allFileContents.forEach(function (file) {
        var filePath = file.value.path;
        var fileContents = file.value.fileContents;
        projectArchive.folder(projectName).file(filePath, fileContents);
      });
      var nodebuffer = projectArchive.generate({ type: 'nodebuffer', createFolders: true });
      var zipPath = path.resolve(__dirname, '../', config.get('tmpDirectory'), projectName + '.zip');
      return fs.writeFileAsync(zipPath, nodebuffer)
        .then(function () {
          return {
            'name': projectName,
            'path': zipPath,
            'buffer': nodebuffer
          };
        });
    })
    .catch(function (err) {
      console.log('Error Getting Project Zip', err);
    });
};

module.exports = getProjectZip;
