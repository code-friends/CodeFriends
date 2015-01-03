'use strict';
var sharejs = require('share');
var Duplex = require('stream').Duplex;
var liveDBMongoClient = require('livedb-mongo');
var livedb = require('livedb');
var db = liveDBMongoClient('mongodb://localhost:27017/codeFriends?auto_reconnect', {
  safe: true
});
var backend = livedb.client(db);
var share = sharejs.server.createClient({
  backend: backend
});


var socketConnectionHandler = function (client) {
  var stream = new Duplex({
    objectMode: true
  });
  stream._write = function (chunk, encoding, callback) {
    client.send(JSON.stringify(chunk));
    return callback();
  };
  stream._read = function () {};
  stream.headers = client.upgradeReq.headers;
  stream.remoteAddress = client.upgradeReq.connection.remoteAddress;

  client.on('message', function (data) {
    return stream.push(JSON.parse(data));
  });
  stream.on('error', function (msg) {
    return client.close(msg);
  });
  client.on('close', function (reason) {
    stream.push(null);
    stream.emit('close');
    return client.close(reason);
  });
  stream.on('end', function () {
    return client.close();
  });
  return share.listen(stream);
};

module.exports = socketConnectionHandler;