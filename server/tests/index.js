/*global describe:true, before: true, after: true */
'use strict';

var config = require('config');
var Promise = require('bluebird');
var should = require('should');
var db = require('../db');
var mongoClient =  Promise.promisifyAll(require('mongodb').MongoClient);

describe('Code Friends', function () {

  before(function (done) {
    // createAllTables is promise
    db.createAllTables.then(function () {
      done();
    });
  });

  require('./db.tests.js');
  require('./integration');

    // Delete All Test Tables
  after(function (done) {
    db.schema.dropTable('projects_users')
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
              return projectCollection.removeAsync();
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
        done();
      })
      .catch(function (err) {
        console.log('Didn\'t delete talbes:', err);
      });
  });

});