'use strict';

var connect = require('connect'),
  http = require('http'),
  shareJSapp = connect(),
  shareJSServer = http.createServer(shareJSapp),
  WebSocketServer = require('ws').Server,
  wss = new WebSocketServer({
    server: shareJSServer
  });
var socketConnectionHandler = require('./socketHandler');

wss.on('connection', socketConnectionHandler);

module.exports = shareJSServer;