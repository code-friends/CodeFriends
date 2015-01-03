var liveDBMongoClient = require('livedb-mongo');
var livedb = require('livedb');
var db = liveDBMongoClient('mongodb://localhost:27017/codeFriends?auto_reconnect', {
	safe: true
});
var backend = livedb.client(db);

module.exports = backend;