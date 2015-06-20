'use strict';

var Promise = require('bluebird');
var config = require('config');
var liveDBRethinkDBClient = require('livedb-rethinkdb');
// var liveDBMongoClient = require('livedb-mongo');
var livedb = require('livedb');
var db = liveDBRethinkDBClient(config.get('rethinkdb'), {
  safe: true
});
var backend = Promise.promisifyAll(livedb.client(db));

module.exports = backend;
