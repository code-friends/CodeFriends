'use strict';
var Promise = require('bluebird');
var r = require('rethinkdb');
require('rethinkdb-init')(r);
var config = require('config');

r.ready = r.init(config.get('rethinkdb'), [
  {
    name: 'project_file_structure'
  },
  {
    name: 'documents'
  },
  {
    name: 'documents_ops'
  }
]).then(function (conn) {
  conn.use(config.get('rethinkdb').db);
  r.conn = conn;
  return conn;
});

module.exports = r;
