/*global describe:true, before: true, after: true */
'use strict';

var db = require('../db');
var deleteAllDatabases = require('../deleteAllDatabases');

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
    deleteAllDatabases()
      .then(function () {
        done();
      })
      .catch(function (err) {
        console.log('Didn\'t delete tables:', err);
      });
  });

});