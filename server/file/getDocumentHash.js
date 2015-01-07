'use strict';
var models = require('../models').models;
var Q = require('q');
var Hashes = require('jshashes');

/**
 * Get the document hash
 *
 * If no projectId is passed, the projectId is queried in the database
 *
 * @param <String> (Document Path '/path/to/file')
 * @param <Number> (projectId)
 * @param <String> (projectName)
 * @return <Promise> -> <String> (documentHash)
 */
var getDocumentHash = function (projectNameOrId, documentPath) {
  if (typeof documentPath !== 'string') throw new Error('Document Path is Not A String');
  return new Q()
    .then(function () {
      if (typeof projectNameOrId === 'number') {
        return projectNameOrId;
      }
      if (typeof projectNameOrId === 'object') {
        if (typeof projectNameOrId.get === 'function' && projectNameOrId.get('id')) {
          return projectNameOrId.get('id');
        }
      }
      if (typeof projectNameOrId === 'string') {
        return models.Project
          .query({
            where: {
              project_name: projectNameOrId
            }
          })
          .fetch()
          .then(function (project) {
            if (!project) throw new Error('No Project Found');
            return project.get('id');
          });
      }
      throw new Error('No Valid Project Name Or ID defined');
    })
    .then(function (projectId) {
      /**
       * Check to see if this is a proper path
       */
      if (documentPath[0] !== '/') {
        documentPath = '/' + documentPath;
      }
      var str = 'p-' + projectId + '-d' + documentPath;
      return new Hashes.SHA256().hex(str);
    });
};

module.exports = getDocumentHash;