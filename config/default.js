'use strict';
/**
 * Configuration Structure
 *
 * default.js
 * - test.js
 * - development.js
 * - - staging.js
 * - - - production.js
 */
var config = {
  'mysql': {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'code_friends'
  },
  'mongo': 'mongodb://127.0.0.1:27017/codeFriends?auto_reconnect',
  'rethinkdb': {
    'host': 'localhost',
    'port': 28015,
    'db': 'code_friends',
  },
  'ports': {
    'http': 8000,
    'editor': 9000,
    'chat': 9001,
    'video': 8005
  },
  'url': '127.0.0.1',
  'github': {
    'clientID': '364ea3bc2b086177fd27',
    'clientSecret': '2dce4e81ad618474f5c822b4567200b941a6c1b1',
  },
  'timeFormat': 'YYYY-MM-DDTHH:MM:SSZ',
  'tmpDirectory': '../data/tmp',
  'gitRepositoriesDirectory': '../data/git-repositories'
};
module.exports = config;
