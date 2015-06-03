'use strict';
/**
 * Inherits from `default.js`
 */
var config = {
  'mysql': {
    'database' : 'code_friends_test'
  },
  'mongo': 'mongodb://localhost:27017/codeFriendsTest?auto_reconnect',
  'rethinkdb': {
    'host': 'localhost',
    'port': 28015,
    'db': 'code_friends_test',
  },
};
module.exports = config;
