#!/usr/bin/env node

/*jshint node:true */
'use strict';

var config = require('config');
var Promise = require('bluebird');
// var mongoClient = Promise.promisifyAll(require('mongodb').MongoClient);
var r = require('rethinkdb');
var db = require('./db');

process.stdin.resume();

var deleteAllDatabases = function () {
  return db.createAllTables
    .then(function () {
      return db.schema.hasTable('projects_users')
        .then(function (exists) {
          if (exists) {
            return db.schema.dropTable('projects_users');
          }
          return true;
        });
    })
    .then(function () {
      return db.schema.hasTable('templates')
        .then(function (exists) {
          if (exists) {
            return db.schema.dropTable('templates');
          }
          return true;
        });
    })
    .then(function () {
      return Promise.all([
        db.schema.hasTable('users').then(function (exists) {
          if (exists) {
            return db.schema.dropTable('users');
          }
          return true;
        }),
        db.schema.hasTable('projects').then(function (exists) {
          if (exists) {
            return db.schema.dropTable('projects');
          }
          return true;
        }),
      ]);
    })
    .then(function () {
      console.log('Deleting All MySQL Tables');
      return true;
    })
    .then(function () {
      return r.connect(config.get('rethinkdb'))
        .then(function (conn) {
          conn.use(config.get('rethinkdb').db);
          Promise.resolve()
            .then(function () {
              return r.tableDrop('documents').run(conn);
            })
            .then(function () {
              return r.tableDrop('documents_ops').run(conn);
            });
        })
        .then(function () {
          console.log('Deleting All RethinkDB Tables');
          return true;
        })
        .catch(function (err) {
          console.log('Error Deleting RethinkDB Tables', err);
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
