/*jshint node:true */
'use strict';

var Promise = require('bludbird')
var fs = Promise.promisifyAll(require('fs'));
var mkdirp = Promise.promisify(require('mkdirp'));
var path = require('path');

var writeFileAndDirecotry = function (filePath, fileContents) {
  return fs.exists(path.dirname(filePath))
    .then(function (exists) {
      if (!exists) {
        // Create directory if it doesn't exist
        return mkdirp(filePath);
      }
      return true;
    })
    .then(function () {
      return fs.writeFileAsync(filePath, fileContents);
    })
    .catch(function (err) {
      console.log('Error Writing File', filePath, err);
    });
};

module.exports = writeFileAndDirecotry;