#!/usr/bin/env node
/*jshint node:true */
'use strict';

var config = require('config');
var Promise = require('bluebird');
var mongoClient =  Promise.promisifyAll(require('mongodb').MongoClient);
var db = require('./db');

process.stdin.resume();

var deleteAllDatabases = function () {
  return db.schema.dropTable('projects_users')
    .then(function () {
      return Promise.all([
        db.schema.dropTable('users'),
        db.schema.dropTable('projects'),
      ]);
    })
    .then(function () {
      console.log('Deleting All MySQL Tables');
      return true;
    })
    .then(function () {
      return mongoClient.connectAsync(config.get('mongo'))
        .then(function (db) {
            var projectCollection = Promise.promisifyAll(db.collection('project_file_structre'));
            return projectCollection.removeAsync()
              .then(function () {
                var documentsCollection = Promise.promisifyAll(db.collection('documents'));
                return documentsCollection.removeAsync();
              })
              .then(function () {
                var documentsCollection = Promise.promisifyAll(db.collection('documents_ops'));
                return documentsCollection.removeAsync();
              });
        })
        .then(function () {
          console.log('Deleting All Mongo Collections');
          return true;
        })
        .catch(function (err) {
          console.log('Error Deleting Mongo Collection', err);
        });
    })
    .then(function () {
      console.log('Deleting Database Done');
    });
};

if (require.main === module) {
  deleteAllDatabases()
    .then(function () {
      process.exit();
    });
}

module.exports = deleteAllDatabases;