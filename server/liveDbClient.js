'use strict';

var Promise = require('bluebird');
var config = require('config');
var liveDBMongoClient = require('livedb-mongo');
var livedb = require('livedb');
var db = liveDBMongoClient(config.get('mongo'), {
	safe: true
});
var backend = Promise.promisifyAll(livedb.client(db));

module.exports = backend;