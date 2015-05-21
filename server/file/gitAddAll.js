'use strict';
var Promise = require('bluebird');
var config = require('config');
var nodegit = require('nodegit');
var isGitUrl = require('./isGitUrl');
var path = require('path');
var wrench = Promise.promisifyAll(require('wrench'));
var rmdirAsync = Promise.promisify(require('rimraf'));
var Q = require('q');
var _ = require('lodash');

var filterIgnoredFiles = require('./uploadController').filterIgnoredFiles;
var addFileFromFileSytemToProject = require('./uploadController')._addFileFromFileSytemToProject;
var updateFileStructure = require('./fileController')._updateFileStructure;

/**
 * XXX
 *
 * @param 
 * @param
 * @return
 */
var gitAddAll = function (project, userId, gitRepoUrl) {
  //get file structure using project param
  
  //recursive function to go through file structure
      //for each file
          //get file path
          //get file contents from mongodb
          
          //if file from path exists in file system
              //write file contents to
          //if the file does not exist 
              //create file with the path
              //write content to file

  //do git add using node-git


  
};

module.exports = gitAddAll;
