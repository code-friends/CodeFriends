var Promise = require('bluebird');
var liveDBMongoClient = require('livedb-mongo');
var livedb = require('livedb');
var db = liveDBMongoClient('mongodb://localhost:27017/codeFriends?auto_reconnect', {
	safe: true
});
var backend = Promise.promisifyAll(livedb.client(db));

module.exports = backend;