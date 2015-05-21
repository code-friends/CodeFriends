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
var gitCommit = function (project, userId, gitRepoUrl) {
  
};

module.exports = gitCommit;

