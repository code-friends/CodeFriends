var Promise = require('bluebird');
var config = require('config');
var _mongoClient = Promise.promisifyAll(require('mongodb').MongoClient);

var mongoClient = _mongoClient.connectAsync(config.get('mongo'));

module.exports = mongoClient;